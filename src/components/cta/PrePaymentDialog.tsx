import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone } from "lucide-react";

interface PrePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

const PrePaymentDialog = ({ open, onClose, onProceedToPayment }: PrePaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-ofair-900 text-center mb-2">
            הרשמה בוצעה בהצלחה
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cyber Monday Promo Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">🔥 מבצע Cyber Monday!</p>
            <p className="text-lg mt-1">
              250₪+מע״מ במקום 350₪!
            </p>
          </div>

          {/* Header Section */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              נשאר רק שלב אחד – ואתם בפנים!
            </h3>
            <p className="text-base text-gray-700">
              כדי להשלים את ההצטרפות לפלטפורמת OFAIR:
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-800">
                בצעו תשלום חד־פעמי של <span className="font-bold line-through text-gray-500">350 ₪</span> <span className="font-bold text-blue-600">250 ₪ + מע״מ</span> בלבד! 🎉
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-800">
                שלחו לנו לפחות <span className="font-bold">5 חשבוניות אחרונות</span> (ללקוחות אמיתיים מהשנה האחרונה)
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-800">
                אנחנו נבדוק את הדירוג שלכם מול לקוחות
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-800">
                אם הדירוג <span className="font-bold">4.2 ומעלה</span> – החשבון שלכם יעלה לאוויר באופן רשמי, לתמיד!
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-800">
                במקרה שהדירוג נמוך מ־4.2 – תקבלו החזר כספי מלא או תוכלו לשלוח עוד 5 חשבוניות לבדיקה חוזרת.
              </p>
            </div>
          </div>

          {/* Highlight Box */}
          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
            <p className="text-sm text-cyan-900 text-center leading-relaxed">
              📌 <span className="font-semibold">ככל שתשלחו יותר חשבוניות</span> – כך הדף שלכם ייראה מקצועי, אמין ומלא חוות דעת!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onProceedToPayment}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg font-bold rounded-xl"
            >
              🔵 בצע תשלום עכשיו
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('tel:0123456789', '_self')}
              className="w-full border-2 border-gray-300 hover:bg-gray-50 py-6 text-lg font-bold rounded-xl"
            >
              <Phone className="w-5 h-5 ml-2" />
              דברו איתנו בטלפון
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Welcome Message */}
          <div className="space-y-4 text-center">
            <p className="text-base text-gray-800">
              <span className="font-bold">ברוכים הבאים ל-oFair!</span> פרטיך התקבלו בהצלחה.
            </p>
            
            <p className="text-sm text-gray-600">
              נשלח מייל עם הנחיות להמשך התהליך (אם לא מוצאים ממליצים לבדוק גם בספאם)
            </p>

            {/* Social Media Section */}
            <div className="space-y-3 pt-4">
              <p className="text-base text-gray-700 font-medium">
                ממש יעזור אם תעקבו אחרינו ברשתות החברתיות
              </p>
              
              <p className="text-sm text-gray-600 italic">
                אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח
              </p>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 pt-2">
                <a
                  href="https://www.tiktok.com/@ofair_professionals?_r=1&_t=ZS-91fxlEC2pnk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="TikTok"
                >
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ofair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/ofair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrePaymentDialog;
