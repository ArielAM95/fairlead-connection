
import React from "react";
import { X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="py-4">
          {showWelcomeMessage && (
            <div>
              <p className="text-center">ברוכים הבאים ל-oFair! פרטיך התקבלו בהצלחה.</p>
              <p className="mt-4 text-center font-medium">נשלח מייל עם הנחיות להמשך התהליך (אם לא מוצאים ממליצים לבדוק גם בספאם)</p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="mb-2 font-medium">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
            <p className="mb-4">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
            
            <div className="flex justify-center space-x-4 mt-2">
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
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
