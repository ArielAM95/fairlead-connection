
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
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm font-medium mb-2">ממש יעזור אם תעקבו אחרינו ברשתות החברתיות</p>
        <p className="text-sm mb-2">אנחנו איתכם ואתם איתנו - ככה בעז״ה נעשה ונצליח</p>
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
    </div>,
    {
      duration: 8000,
    }
  );
};
