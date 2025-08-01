
import React from "react";
import { X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Custom TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface NotificationPopupProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userPhone?: string;
  showWelcomeMessage?: boolean;
}

const NotificationPopup = ({
  title,
  description,
  isOpen,
  onClose,
  userName = "",
  userPhone = "",
  showWelcomeMessage = false,
}: NotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Format the user's first name for the welcome message
  const firstName = userName.split(" ")[0] || "";
  
  // Create the document upload URL with user parameters
  const documentUploadUrl = `https://docs.ofair.co.il/?phone=${encodeURIComponent(userPhone || "")}&name=${encodeURIComponent(userName || "")}`;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto ${
          isOpen ? "animate-scale-in" : "animate-scale-out"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {showWelcomeMessage && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">נשאר רק שלב אחד – ואתם בפנים!</h3>
            
            <div className="mb-6">
              <p className="mb-4 font-medium">כדי להשלים את ההצטרפות לפלטפורמת OFAIR:</p>
              
              <ol className="mb-4 list-none space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>בצעו תשלום חד־פעמי של 350 ₪ בלבד</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>שלחו לנו לפחות 5 חשבוניות אחרונות (ללקוחות אמיתיים מהשנה האחרונה)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>אנחנו נבדוק את הדירוג שלכם מול לקוחות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>אם הדירוג 4.2 ומעלה – החשבון שלכם יעלה לאוויר באופן רשמי, לתמיד!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>במקרה שהדירוג נמוך מ־4.2 – תקבלו החזר כספי מלא או תוכלו לשלוח עוד 5 חשבוניות לבדיקה חוזרת.</span>
                </li>
              </ol>
              
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-cyan-800">
                  📌 ככל שתשלחו יותר חשבוניות – כך הדף שלכם ייראה מקצועי, אמין ומלא חוות דעת!
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <a 
                  href="https://app.icount.co.il/m/12419/c692686dp3u687d0a2c?utm_source=iCount&utm_medium=paypage&utm_campaign=3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3 bg-[#00327B] text-white rounded-lg font-medium hover:bg-[#002a66] transition-colors"
                >
                  🔵 בצע תשלום עכשיו
                </a>
                <button 
                  onClick={() => window.open('tel:+972537779773', '_self')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  🔘 דברו איתנו בטלפון
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-6"></div>
          </div>
        )}
        
        <div className="text-gray-700 mb-4">{description}</div>
        <p className="text-sm text-muted-foreground mt-1">נשלח מייל עם הנחיות להמשך התהליך (אם לא מוצאים ממליצים לבדוק גם בספאם)</p>
        
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm font-medium mb-2">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
          <p className="text-sm mb-3">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
          <div className="flex gap-2 mt-2 justify-center">
            <a 
              href="https://www.facebook.com/profile.php?id=61573771175534#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://www.instagram.com/ofair_il?fbclid=IwZXh0bgNhZW0CMTAAAR1Hdq28l9YzB4sHU41YXjS5UYVD_LihmktdeE0cqacfrxkIm1ryJ6_Y3qQ_aem_uZmC0wj1Asq9SbLb9ZLcWg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.tiktok.com/@ofair.co.il?_t=ZS-8xQd5lF74xL&_r=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <TikTokIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
