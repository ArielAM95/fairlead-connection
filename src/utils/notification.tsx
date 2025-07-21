
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
  // If we have user data and should show welcome message, use the enhanced version
  if (showWelcomeMessage && userName) {
    const firstName = userName.split(" ")[0] || "";
    const documentUploadUrl = `https://docs.ofair.co.il/?phone=${encodeURIComponent(userPhone || "")}&name=${encodeURIComponent(userName || "")}`;
    
    toast(
      <div>
        <h3 className="font-medium text-base">{title}</h3>
        
        <div className="mb-5">
          <h4 className="text-lg font-bold mb-3">כמעט בפנים! 😎 סוגרים פינה עם ההרשמה ל-oFair</h4>
          <p className="font-medium mb-2">היי {firstName}! 👑</p>
          
          <p className="mb-2">כיף שבחרת להצטרף ל-oFair – המקום שבו בעלי מקצוע כמוך עושים יותר כסף, מבזבזים פחות זמן, ופשוט... חיים טוב יותר! 🚀</p>
          
          <p className="mb-2">אבל רגע! לפני שאתה נכנס לעולם של לידים איכותיים ולקוחות שמחכים רק לך – יש לנו משימה קטנה:</p>
          
          <p className="font-medium mb-1">🎯 להשלים את ההרשמה ולתפוס מקום אצלנו בסטייל:</p>
          
          <ul className="mb-3 list-none">
            <li className="mb-1">✅ תעלה לפחות 5 חשבוניות של עבודות שביצעת</li>
            <li>✅ תוסיף תעודות הסמכה / רישיון עבודה</li>
          </ul>
          
          <p className="font-medium">📤 יאללה, תעלה את הקבצים כאן – ונגמר הסיפור:</p>
          <p className="mb-2">
            <a 
              href={documentUploadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              🔗 להעלאת חשבוניות
            </a>
          </p>
          
          <div className="border-t border-gray-200 my-3"></div>
        </div>
        
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground mt-1">נשלח מייל עם הנחיות להמשך התהליך (אם לא מוצאים ממליצים לבדוק גם בספאם)</p>
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm font-medium mb-2">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
          <p className="text-sm mb-2">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
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
      </div>,
      {
        duration: 12000, // Extended duration since there's more content
      }
    );
  } else {
    // Use the regular success notification
    toast(
      <div>
        <h3 className="font-medium text-base">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground mt-1">נשלח מייל עם הנחיות להמשך התהליך (אם לא מוצאים ממליצים לבדוק גם בספאם)</p>
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm font-medium mb-2">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
          <p className="text-sm mb-2">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
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
      </div>,
      {
        duration: 8000,
      }
    );
  }
};
