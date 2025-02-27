
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <a href="#" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-bold text-ofair-900">oFair</span>
            </a>
            <p className="text-gray-600 mt-2">🔹 oFair – מהפכת שיתוף הלידים והעבודה החכמה כבר כאן!</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex space-x-8 space-x-reverse mb-4">
              <a href="#what-is" className="text-gray-600 hover:text-ofair-900 transition-colors">
                מה זה oFair?
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-ofair-900 transition-colors">
                יתרונות
              </a>
              <a href="#problems" className="text-gray-600 hover:text-ofair-900 transition-colors">
                איך זה עובד?
              </a>
              <a href="#contact" className="text-gray-600 hover:text-ofair-900 transition-colors">
                צור קשר
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} oFair. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
