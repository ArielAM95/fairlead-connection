
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '972505577565'; // Remove the first 0 and add 972 country code
    const message = encodeURIComponent('היי, אני צריך עזרה עם ההרשמה ל-oFair');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed left-4 bottom-20 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="פנו אלינו בוואטסאפ"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppButton;
