import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";

// Custom TikTok icon component since it's not in lucide-react
const TikTokIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>;
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="pt-16 pb-10 bg-blue-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo and tagline */}
          <div className="md:col-span-5">
            <a href="#" className="flex items-center mb-5">
              <img src="/lovable-uploads/ofair-logo.png" alt="oFair Logo" className="h-18 w-auto" />
            </a>
            <p className="text-white/90 text-lg mb-3">🔹 oFair – מהפכת שיתוף הלידים והעבודה החכמה כבר כאן!</p>
            <p className="text-white/80 text-sm">הפלטפורמה שתחבר בין בעלי מקצוע, מאפשרת שיתוף לידים ומציגה הצעות מחיר בזמן אמת</p>
          </div>
          
          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-white text-lg mb-5">ניווט מהיר</h3>
            <nav className="flex flex-col space-y-3">
              <a href="#what-is" className="text-white/80 hover:text-white transition-colors">
                מה זה oFair?
              </a>
              <a href="#benefits" className="text-white/80 hover:text-white transition-colors">
                יתרונות
              </a>
              <a href="#problems" className="text-white/80 hover:text-white transition-colors">
                פתרונות לבעיות
              </a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
                איך זה עובד?
              </a>
              <Link to="/terms" className="text-white/90 hover:text-white underline font-medium">
                תקנון ותנאי פרטיות
              </Link>
            </nav>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="font-semibold text-white text-lg mb-5">צור קשר</h3>
            <div className="space-y-4">
              <p className="text-white/80 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 text-white flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:info@ofair.co.il" className="hover:text-white transition-colors">info@ofair.co.il</a>
              </p>
              <p className="text-white/80 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 text-white flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <a href="tel:+972545308505" className="hover:text-white transition-colors">054-5308505</a>
              </p>
              <div className="flex space-x-4 space-x-reverse mt-6">
                <a href="https://www.facebook.com/profile.php?id=61573771175534#" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/ofair_il?fbclid=IwZXh0bgNhZW0CMTAAAR1Hdq28l9YzB4sHU41YXjS5UYVD_LihmktdeE0cqacfrxkIm1ryJ6_Y3qQ_aem_uZmC0wj1Asq9SbLb9ZLcWg" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.tiktok.com/@ofair.co.il?_t=ZS-8xQd5lF74xL&_r=1" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                  <TikTokIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80 text-sm">&copy; {currentYear} oFair. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;