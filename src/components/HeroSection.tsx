
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const staggeredContainer = elementRef.current?.querySelector(".staggered-animation");
    if (staggeredContainer) {
      const childElements = staggeredContainer.children;
      Array.from(childElements).forEach((el, i) => {
        // Add transition delay and observe each element
        (el as HTMLElement).style.transitionDelay = `${i * 100}ms`;
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    const ctaSection = document.querySelector('#signup-form');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const scrollToWhatIs = () => {
    const whatIsSection = document.querySelector('#what-is');
    if (whatIsSection) {
      whatIsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Content Overlay */}
      <div className="container mx-auto px-4 md:px-6 py-20 relative w-full">
        <div className="max-w-6xl mx-auto">
          {/* Mobile and Tablet Layout */}
          <div className="lg:hidden text-right">
            <div ref={elementRef} className="staggered-animation">
              <div className="mobile-hero-item">
                <div className="flex items-start gap-4 mb-8">
                  <div className="flex-shrink-0">
                    <img 
                      src="/lovable-uploads/01360891-da5d-43ab-94f6-35060af38c05.png" 
                      alt="oFair Character" 
                      className="w-24 sm:w-32 h-auto object-contain drop-shadow-2xl animate-float"
                    />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                    oFair – כל ליד שווה לכם כסף: קבלו לידים איכותיים, או שתפו ותיהנו מרווח מיידי!
                  </h1>
                </div>
              </div>
              
              <div className="mobile-hero-item">
                <p className="text-xl lg:text-2xl text-white/90 mb-6 drop-shadow-md">
                  פלטפורמת oFair מחברת בין בעלי מקצוע מכל התחומים, ומאפשרת לכם לקבל לידים איכותיים ומפורטים, לשתף לידים שלא מתאימים לכם ולהרוויח מהם – הכול במקום אחד!
                </p>
              </div>
              
              <div className="mobile-hero-item">
                <p className="text-xl lg:text-2xl font-bold text-white mb-8 drop-shadow-md">
                  📢 הגיע הזמן לעבוד חכם יותר ולהרוויח יותר!
                </p>
              </div>
              
              <div className="mobile-hero-item">
                <div className="flex flex-col sm:flex-row gap-6 justify-end mb-8">
                  <Button 
                    className="bg-gradient-to-r from-secondary to-secondary-light text-white px-10 py-6 text-lg button-pulse shadow-xl" 
                    onClick={scrollToForm}
                  >
                    <span>הירשמו כעת</span>
                    <ChevronRight className="mr-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-6 text-lg shadow-xl" 
                    onClick={scrollToWhatIs}
                  >
                    <span>קרא עוד</span>
                  </Button>
                </div>
              </div>
              
              {/* Key Points scattered on background */}
              <div className="mobile-hero-item">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">זה רק FAIR</h3>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      קבלו גישה ללקוחות איכותיים שמחפשים הצעות בצורה פשוטה
                    </p>
                  </div>
                  
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">💰 רק על עבודות שבוצעו</h3>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      שתפו לידים לא רלוונטיים עם בעלי מקצוע אחרים והרוויחו
                    </p>
                  </div>
                  
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex space-x-1 space-x-reverse ml-2">
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse delay-75"></span>
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse delay-150"></span>
                      </div>
                      <span className="text-secondary text-xl font-bold drop-shadow-lg">עולה לאוויר בקרוב</span>
                    </div>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      🚀 הטבה ייחודית בדמי ההקמה למצטרפים כעת!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div ref={elementRef} className="staggered-animation text-right">
              <div className="desktop-hero-item">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
                  oFair – כל ליד שווה לכם כסף: קבלו לידים איכותיים, או שתפו ותיהנו מרווח מיידי!
                </h1>
              </div>
              
              <div className="desktop-hero-item">
                <p className="text-xl lg:text-2xl text-white/90 mb-6 drop-shadow-md">
                  פלטפורמת oFair מחברת בין בעלי מקצוע מכל התחומים, ומאפשרת לכם לקבל לידים איכותיים ומפורטים, לשתף לידים שלא מתאימים לכם ולהרוויח מהם – הכול במקום אחד!
                </p>
              </div>
              
              <div className="desktop-hero-item">
                <p className="text-xl lg:text-2xl font-bold text-white mb-8 drop-shadow-md">
                  📢 הגיע הזמן לעבוד חכם יותר ולהרוויח יותר!
                </p>
              </div>
              
              <div className="desktop-hero-item">
                <div className="flex flex-col sm:flex-row gap-6 justify-end mb-8">
                  <Button 
                    className="bg-gradient-to-r from-secondary to-secondary-light text-white px-10 py-6 text-lg button-pulse shadow-xl" 
                    onClick={scrollToForm}
                  >
                    <span>הירשמו כעת</span>
                    <ChevronRight className="mr-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-6 text-lg shadow-xl" 
                    onClick={scrollToWhatIs}
                  >
                    <span>קרא עוד</span>
                  </Button>
                </div>
              </div>
              
              {/* Key Points scattered on background */}
              <div className="desktop-hero-item">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">זה רק FAIR</h3>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      קבלו גישה ללקוחות איכותיים שמחפשים הצעות בצורה פשוטה
                    </p>
                  </div>
                  
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">💰 רק על עבודות שבוצעו</h3>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      שתפו לידים לא רלוונטיים עם בעלי מקצוע אחרים והרוויחו
                    </p>
                  </div>
                  
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex space-x-1 space-x-reverse ml-2">
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse delay-75"></span>
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse delay-150"></span>
                      </div>
                      <span className="text-secondary text-xl font-bold drop-shadow-lg">עולה לאוויר בקרוב</span>
                    </div>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      🚀 הטבה ייחודית בדמי ההקמה למצטרפים כעת!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/lovable-uploads/01360891-da5d-43ab-94f6-35060af38c05.png" 
                  alt="oFair Character" 
                  className="w-80 h-auto object-contain drop-shadow-2xl animate-float"
                />
                {/* Glowing effect behind character */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-secondary-light/30 blur-3xl -z-10 scale-110"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
