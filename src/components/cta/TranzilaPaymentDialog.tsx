import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

const REGISTRATION_FEE = 413; // ₪ כולל מע"מ

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
  }) => void;
  userDetails: {
    name: string;
    idNumber: string;
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
      console.log('Getting handshake token...');

      const { data, error } = await supabase.functions.invoke('tranzila-handshake');

      if (error) {
        console.error('Handshake error:', error);
        throw error;
      }

      const { handshakeToken, terminal } = data;
      console.log('Handshake token received, terminal:', terminal);

      // Load Tranzila SDK script
      const script = document.createElement('script');
      script.src = 'https://hf.tranzila.com/assets/js/thostedf.js';
      script.async = true;
      script.onload = () => {
        console.log('Tranzila SDK loaded');
        setSdkLoaded(true);
        initHostedFields(handshakeToken, terminal);
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
        token: handshakeToken,
        supplier: terminal,
        hostedFieldsNames: {
          ccno: 'hosted-card-number',
          cvv: 'hosted-cvv',
          expdate: 'hosted-expiry',
        },
        invalidInputEventHandler: (field: string) => {
          console.log('Invalid field:', field);
        },
      });

      hostedFieldsInstance.on('ready', () => {
        console.log('Tranzila Hosted Fields ready');
        setFieldsReady(true);
      });

      hostedFieldsInstance.on('validityChange', (event: any) => {
        console.log('Field validity changed:', event);
      });

      // Store for charge
      (window as any).tranzilaInstance = hostedFieldsInstance;

    } catch (error) {
      console.error('Hosted fields init error:', error);
      toast.error('שגיאה באתחול שדות תשלום');
    }
  };

  const handlePayment = async () => {
    if (!fieldsReady) {
      toast.error('שדות התשלום טרם מוכנים');
      return;
    }

    setIsProcessing(true);

    try {
      const tranzilaInstance = (window as any).tranzilaInstance;

      if (!tranzilaInstance) {
        throw new Error('Tranzila instance not found');
      }

      // Validate card fields
      const validation = await tranzilaInstance.validate();
      if (!validation.valid) {
        toast.error('פרטי כרטיס אינם תקינים');
        setIsProcessing(false);
        return;
      }

      console.log('Charging registration fee via Tranzila...');

      // Charge with Tranzila (includes tokenization)
      const chargeResult = await tranzilaInstance.charge({
        sum: REGISTRATION_FEE.toFixed(2),
        currency: '1', // ILS
        cred_type: '1', // Regular payment
        tranmode: 'A', // Authorization + Capture
        pdesc: `דמי הרשמה - ${userDetails.name}`,
        id: userDetails.idNumber,
        createtoken: '1', // טוקניזציה
      });

      console.log('Tranzila charge result:', chargeResult);

      if (!chargeResult || chargeResult.error) {
        throw new Error(chargeResult?.error || 'Charge failed');
      }

      toast.success(`תשלום בסך ₪${REGISTRATION_FEE} בוצע בהצלחה!`);

      // Return payment data to parent
      onSuccess({
        tranzila_token: chargeResult.TranzilaToken,
        tranzila_index: chargeResult.index,
        card_last4: chargeResult.ccno_4,
        card_expiry: chargeResult.expdate,
        card_type: chargeResult.issuer || 'unknown',
        confirmation_code: chargeResult.ConfirmationCode,
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'שגיאה בביצוע התשלום');
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
              <Label>מספר כרטיס *</Label>
              <div 
                id="hosted-card-number" 
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>תוקף (MM/YY) *</Label>
                <div 
                  id="hosted-expiry" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label>CVV *</Label>
                <div 
                  id="hosted-cvv" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
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
