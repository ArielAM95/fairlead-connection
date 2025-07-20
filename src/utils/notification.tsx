
import React from "react";
import { toast } from "sonner";
import { Facebook, Instagram } from "lucide-react";

// Custom TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const showNotification = (title: string, description: string) => {
  toast(title, {
    description: description,
    duration: 5000,
  });
};

export const showSuccessNotification = (
  title: string, 
  description: string, 
  userName?: string,
  userPhone?: string,
  showWelcomeMessage?: boolean
) => {
  const firstName = userName?.split(" ")[0] || "";
  
  toast(
    <div className="max-w-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">נשאר רק שלב אחד – ואתם בפנים!</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <p className="font-medium text-base">כדי להשלים את ההצטרפות לפלטפורמת OFAIR:</p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <p className="text-sm">בצעו תשלום חד־פעמי של 350 ₪ בלבד</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <p className="text-sm">שלחו לנו לפחות 5 חשבוניות אחרונות (ללקוחות אמיתיים מהשנה האחרונה)</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <p className="text-sm">אנחנו נבדוק את הדירוג שלכם מול לקוחות</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
            <p className="text-sm">אם הדירוג 4.2 ומעלה – החשבון שלכם יעלה לאוויר באופן רשמי, לתמיד!</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-4">
          <p className="text-sm text-blue-800">
            במקרה שהדירוג נמוך מ־4.2 – תקבלו החזר כספי מלא או תוכלו לשלוח עוד 5 חשבוניות לבדיקה חוזרת.
          </p>
        </div>
        
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
          <p className="text-sm text-cyan-800 font-medium">
            📌 ככל שתשלחו יותר חשבוניות – כך הדף שלכם ייראה מקצועי, אמין ומלא חוות דעת!
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <a 
          href="https://app.icount.co.il/m/12419/c692686dp3u687d0a2c?utm_source=iCount&utm_medium=paypage&utm_campaign=3"
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-[#00327B] text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-[#002a66] transition-colors"
        >
          🔵 בצע תשלום עכשיו
        </a>
        
        <button 
          className="block w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          onClick={() => window.open('tel:+972-50-123-4567', '_self')}
        >
          🔘 רוצים לדבר איתנו קודם? לחצו כאן להתקשרות
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <div className="flex gap-2 mt-2 justify-center">
          <a 
            href="https://www.facebook.com/profile.php?id=61573771175534#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Facebook size={16} />
          </a>
          <a 
            href="https://www.instagram.com/ofair_il?fbclid=IwZXh0bgNhZW0CMTAAAR1Hdq28l9YzB4sHU41YXjS5UYVD_LihmktdeE0cqacfrxkIm1ryJ6_Y3qQ_aem_uZmC0wj1Asq9SbLb9ZLcWg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Instagram size={16} />
          </a>
          <a 
            href="https://www.tiktok.com/@ofair.co.il?_t=ZS-8xQd5lF74xL&_r=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <TikTokIcon size={16} />
          </a>
        </div>
      </div>
    </div>,
    {
      duration: 15000,
    }
  );
};
