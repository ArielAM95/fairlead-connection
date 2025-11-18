import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Tranzila SDK Types
declare global {
  interface Window {
    TzlaHostedFields?: {
      create: (options: any) => any;
    };
  }
}

const REGISTRATION_FEE = 413; // ₪ Production registration fee

interface TranzilaPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentData: {
    tranzila_token: string;
    tranzila_index: string;
    card_last4: string;
    card_expiry: string;
    card_type: string;
    confirmation_code: string;
    save_card?: boolean;
  }) => void;
  userDetails: {
    name: string;
    idNumber: string;
    phone?: string;
    email?: string;
    city?: string;
    companyName?: string;
  };
}

export default function TranzilaPaymentDialog({
  open,
  onClose,
  onSuccess,
  userDetails,
}: TranzilaPaymentDialogProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [fieldsReady, setFieldsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [handshakeToken, setHandshakeToken] = useState<string>('');
  const [terminalName, setTerminalName] = useState<string>('');
  const [saveCard, setSaveCard] = useState(true); // Default: checked

  // 🔒 Disconnect Supabase realtime (למניעת שגיאת JSON.parse)
  useEffect(() => {
    if (open) {
      const channels = supabase.getChannels();
      channels.forEach(channel => channel.unsubscribe());
    }
  }, [open]);

  // 📦 Load Tranzila SDK when dialog opens
  useEffect(() => {
    if (open && !sdkLoaded) {
      loadTranzilaSDK();
    }
  }, [open, sdkLoaded]);

  const loadTranzilaSDK = async () => {
    try {
      console.log('Getting handshake token for amount:', REGISTRATION_FEE);

      // Use public handshake (no auth required for registration)
      // IMPORTANT: Pass the exact amount that will be charged
      const { data, error } = await supabase.functions.invoke('tranzila-handshake-public', {
        body: { amount: REGISTRATION_FEE.toFixed(2) }
      });

      if (error) {
        console.error('Handshake error:', error);
        throw error;
      }

      const { handshakeToken: token, terminal } = data;
      console.log('Handshake token received for', REGISTRATION_FEE, 'ILS, terminal:', terminal);

      setHandshakeToken(token);
      setTerminalName(terminal);

      // Load Tranzila SDK script
      const script = document.createElement('script');
      script.src = 'https://hf.tranzila.com/assets/js/thostedf.js';
      script.async = true;
      script.onload = () => {
        console.log('Tranzila SDK loaded');
        setSdkLoaded(true);
        initHostedFields(token, terminal);
      };
      script.onerror = () => {
        console.error('Failed to load Tranzila SDK');
        toast.error('שגיאה בטעינת מערכת התשלום');
      };
      document.body.appendChild(script);

    } catch (error: any) {
      console.error('SDK load error:', error);
      toast.error('שגיאה בטעינת מערכת התשלום');
    }
  };

  const initHostedFields = (handshakeToken: string, terminal: string) => {
    if (!window.TzlaHostedFields) {
      toast.error('מערכת התשלום לא זמינה');
      return;
    }

    try {
      const hostedFieldsInstance = window.TzlaHostedFields.create({
        sandbox: false,
        terminal_name: terminal,
        handshake_token: handshakeToken,
        fields: {
          credit_card_number: { selector: '#hosted-card-number' },
          cvv: { selector: '#hosted-cvv' },
          expiry: { selector: '#hosted-expiry' }
        }
      });

      hostedFieldsInstance.onEvent('ready', () => {
        console.log('Tranzila Hosted Fields ready');
        setFieldsReady(true);
      });

      hostedFieldsInstance.onEvent('validityChange', (event: any) => {
        console.log('Field validity changed:', event);
      });

      // Store for charge
      (window as any).tranzilaInstance = hostedFieldsInstance;
      (window as any).tranzilaTerminal = terminal;
      (window as any).tranzilaHandshakeToken = handshakeToken;

    } catch (error) {
      console.error('Hosted fields init error:', error);
      toast.error('שגיאה באתחול שדות תשלום');
    }
  };

  const sendToMakeWebhook = (tranzilaResponse: any, success: boolean, errorMessage?: string) => {
    fetch('https://hook.eu2.make.com/f6ktm70ppeik9wyo7jey5tljf5bcf5xj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tranzila_response: tranzilaResponse,
        user_details: userDetails,
        timestamp: new Date().toISOString(),
        amount: REGISTRATION_FEE,
        success: success,
        error_message: errorMessage || null,
        source: 'payment_dialog'
      })
    }).catch(err => {
      console.error('Failed to send Tranzila response to Make.com:', err);
      // Non-blocking - don't throw error
    });
  };

  const handlePayment = async () => {
    if (!fieldsReady) {
      toast.error('שדות התשלום טרם מוכנים');
      return;
    }

    setIsProcessing(true);
    let chargeResult: any = null;

    try {
      const tranzilaInstance = (window as any).tranzilaInstance;

      if (!tranzilaInstance) {
        throw new Error('Tranzila instance not found');
      }

      console.log('Tranzila instance found:', !!tranzilaInstance);

      // Get terminal from window
      const terminal = (window as any).tranzilaTerminal;

      if (!terminal) {
        throw new Error('Missing terminal name');
      }

      console.log('Terminal name:', terminal);

      // ✅ FIX: Use the SAME handshake token that was used to initialize the SDK
      // The Hosted Fields instance is bound to the original handshake token
      // We cannot use a different token - must use the one from initialization
      const token = (window as any).tranzilaHandshakeToken;

      if (!token) {
        throw new Error('Missing handshake token');
      }

      console.log('Using handshake token from SDK initialization (first 10 chars):', token.substring(0, 10));
      console.log('Charging registration fee via Tranzila...');

      // Charge with Tranzila (includes tokenization) - Using callback pattern from docs
      const chargeParams = {
        terminal_name: terminal,
        thtk: token, // Use same token that initialized the Hosted Fields
        amount: REGISTRATION_FEE.toFixed(2),
        currency_code: 'ILS',
        tran_mode: 'A', // Authorization + Capture
        tokenize: true,  // Enable tokenization
        // ✅ AUTO-INVOICE GENERATION FIELDS
        // Including these fields triggers Tranzila to auto-generate and email invoice
        contact: userDetails.name,
        email: userDetails.email || `${userDetails.phone}@temp.ofair.co.il`, // Fallback if no email
        company: userDetails.companyName || userDetails.name,
        id: userDetails.idNumber || '' // Business license number for Israeli tax compliance
      };

      console.log('Charging with params (amount, terminal, invoice):', {
        amount: chargeParams.amount,
        terminal: chargeParams.terminal_name,
        tokenPrefix: chargeParams.thtk.substring(0, 10),
        contact: chargeParams.contact,
        email: chargeParams.email,
        company: chargeParams.company,
        hasBusinessLicense: !!chargeParams.id
      });

      // ✅ FIX 2: Add timeout to prevent hanging
      chargeResult = await Promise.race([
        new Promise<any>((resolve, reject) => {
          tranzilaInstance.charge(
            chargeParams,
            (err: any, response: any) => {
              if (err) {
                console.error('Charge error from Tranzila:', err);
                reject(err);
              } else {
                console.log('Charge response from Tranzila:', response);
                resolve(response);
              }
            }
          );
        }),
        // Timeout after 30 seconds
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('התשלום לקח זמן רב מדי. אנא נסה שוב')), 30000)
        )
      ]);

      console.log('Tranzila charge result:', chargeResult);

      // Extract token from response according to docs
      const txnResponse = chargeResult.transaction_response;

      // Check if payment was successful
      if (!txnResponse?.success || txnResponse.processor_response_code !== '000') {
        const errorMessage = txnResponse?.processor_response_message || 'Unknown error';
        // Send failed attempt to webhook
        sendToMakeWebhook(chargeResult, false, errorMessage);
        throw new Error('Charge failed: ' + errorMessage);
      }

      // Send successful attempt to webhook
      sendToMakeWebhook(chargeResult, true);

      const tranzilaToken = txnResponse.token;
      const last4 = String(txnResponse.credit_card_last_4_digits).padStart(4, '0').slice(-4);
      const expiry_month = Number(txnResponse.expiry_month);
      const expiry_year = Number(txnResponse.expiry_year);

      toast.success(`תשלום בסך ₪${REGISTRATION_FEE} בוצע בהצלחה!`);

      // Return payment data to parent - format for SignupForm compatibility
      onSuccess({
        tranzila_token: tranzilaToken,
        tranzila_index: txnResponse.token_index || '',
        card_last4: last4,
        card_expiry: `${String(expiry_month).padStart(2, '0')}${String(expiry_year).slice(-2)}`, // MMYY format
        card_type: txnResponse.credit_card_type || 'unknown',
        confirmation_code: txnResponse.confirmation_code || '',
        save_card: saveCard, // User's choice to save card
      });

    } catch (error: any) {
      console.error('Payment error details:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor?.name,
        chargeResult: chargeResult
      });

      // Send error to webhook if we have a charge result
      if (chargeResult) {
        sendToMakeWebhook(chargeResult, false, error.message);
      } else {
        // Send error without Tranzila response (pre-charge error)
        sendToMakeWebhook({ error: error.message }, false, error.message);
      }

      // ✅ FIX 3: Better error messages for users
      let userMessage = error.message || 'שגיאה בביצוע התשלום';

      // Don't modify already translated error messages
      if (!userMessage.includes('שגיאה') && !userMessage.includes('Charge failed')) {
        if (error.message.includes('timeout') || error.message.includes('לקח זמן רב')) {
          userMessage = 'התשלום לקח זמן רב מדי. אנא נסה שוב';
        } else if (error.message.includes('handshake') || error.message.includes('חיבור')) {
          userMessage = 'שגיאה בחיבור למערכת התשלום. אנא רענן את הדף ונסה שוב';
        } else if (error.message.includes('instance not found')) {
          userMessage = 'מערכת התשלום לא זמינה. אנא רענן את הדף';
        }
      }

      toast.error(userMessage);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ofair-900">ביצוע תשלום</DialogTitle>
          <DialogDescription className="text-lg">
            דמי הרשמה: ₪{REGISTRATION_FEE} כולל מע"מ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* פרטי תשלום - Hosted Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right block">מספר כרטיס *</Label>
              <div 
                id="hosted-card-number" 
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right block">תוקף (MM/YY) *</Label>
                <div 
                  id="hosted-expiry" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">CVV *</Label>
                <div 
                  id="hosted-cvv" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* שמירת כרטיס לשימוש עתידי */}
          <div className="flex items-center gap-2 rtl:gap-x-reverse">
            <Checkbox
              id="save-card"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              disabled={isProcessing}
            />
            <Label
              htmlFor="save-card"
              className="text-sm font-normal cursor-pointer leading-tight"
            >
              שמור את פרטי הכרטיס לשימוש עתידי באפליקציה
            </Label>
          </div>

          {/* הודעת אבטחה */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <span className="text-lg">🔒</span>
            <p>פרטי הכרטיס מוצפנים ומאובטחים על ידי Tranzila</p>
          </div>

          {/* סטטוס */}
          <div className="text-center text-sm">
            {!sdkLoaded && <p className="text-muted-foreground">טוען מערכת תשלום...</p>}
            {sdkLoaded && !fieldsReady && <p className="text-muted-foreground">מכין שדות תשלום...</p>}
            {fieldsReady && <p className="text-green-600 font-medium">✓ מערכת התשלום מוכנה</p>}
          </div>

          {/* כפתורי פעולה */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              ביטול
            </Button>
            <Button
              type="button"
              onClick={handlePayment}
              disabled={!fieldsReady || isProcessing}
              className="flex-1 bg-ofair-900 hover:bg-ofair-800"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  מעבד תשלום...
                </span>
              ) : (
                `שלם ₪${REGISTRATION_FEE}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
