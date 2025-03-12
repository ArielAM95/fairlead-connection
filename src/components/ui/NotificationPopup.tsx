
import React from "react";
import { X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

interface NotificationPopupProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopup = ({
  title,
  description,
  isOpen,
  onClose,
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 ${
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
        <div className="text-gray-700 mb-4">{description}</div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium mb-2">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
          <p className="text-sm mb-3">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
          <div className="flex gap-2 mt-2">
            <a 
              href="https://facebook.com/ofairisrael" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://instagram.com/ofair.israel" 
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
  );
};

export default NotificationPopup;
