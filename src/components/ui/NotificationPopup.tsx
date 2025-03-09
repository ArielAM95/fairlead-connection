
import { X } from "lucide-react";
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
        <div className="text-gray-700">{description}</div>
      </div>
    </div>
  );
};

export default NotificationPopup;
