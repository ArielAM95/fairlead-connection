import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface PrePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

const PrePaymentDialog = ({ open, onClose, onProceedToPayment }: PrePaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ofair-900 text-center">
            עוד צעד אחד ואתם איתנו! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-4">
            אתם כמעט סיימתם! כדי להשלים את ההרשמה למערכת OFAIR, נדרש תשלום חד-פעמי של <span className="font-bold text-ofair-900">₪413</span> (כולל מע"מ).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-ofair-50 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-ofair-900 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">גישה מלאה לפלטפורמה</span> - התחילו לקבל הזמנות מיד לאחר ההרשמה
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-ofair-900 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">פרופיל מקצועי</span> - הצגת השירותים שלכם ללקוחות פוטנציאליים
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-ofair-900 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">מערכת ניהול הזמנות</span> - כלים מתקדמים לניהול העבודות שלכם
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-900 text-center">
              💳 <span className="font-semibold">תשלום מאובטח</span> - פרטי הכרטיס שלכם מוצפנים ומאובטחים במלואם
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            ביטול
          </Button>
          <Button
            onClick={onProceedToPayment}
            className="flex-1 bg-ofair-900 hover:bg-ofair-800 text-white"
          >
            לתשלום ₪413
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrePaymentDialog;
