
import React from "react";
import { toast } from "sonner";
import { Facebook, Instagram } from "lucide-react";

export const showNotification = (title: string, description: string) => {
  toast(title, {
    description: description,
    duration: 5000,
  });
};

export const showSuccessNotification = (title: string, description: string) => {
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
        </div>
      </div>
    </div>,
    {
      duration: 8000,
    }
  );
};
