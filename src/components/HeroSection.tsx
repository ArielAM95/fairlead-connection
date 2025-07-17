import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import heroBackground from "@/assets/hero-background.jpg";
const HeroSection = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });
    const childElements = elementRef.current?.querySelectorAll(".staggered-animation > *");
    childElements?.forEach((el, i) => {
      el.classList.add("transition-delay-" + i);
      observer.observe(el);
    });
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
  return <div className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground}
          alt="Professional collaboration background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="container mx-auto px-4 md:px-6 py-20 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div ref={elementRef} className="staggered-animation text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
              oFair – כל ליד שווה לכם כסף: קבלו לידים איכותיים, או שתפו ותיהנו מרווח מיידי!
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-6 max-w-4xl mx-auto drop-shadow-md">
              פלטפורמת oFair מחברת בין בעלי מקצוע מכל התחומים, ומאפשרת לכם לקבל לידים איכותיים ומפורטים, לשתף לידים שלא מתאימים לכם ולהרוויח מהם – הכול במקום אחד!
            </p>
            
            <p className="text-xl lg:text-2xl font-bold text-white mb-8 drop-shadow-md">
              📢 הגיע הזמן לעבוד חכם יותר ולהרוויח יותר!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg button-pulse shadow-xl" 
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
            
            {/* Key Points scattered on background */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
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
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-75"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-150"></span>
                  </div>
                  <span className="text-green-400 text-xl font-bold drop-shadow-lg">עולה לאוויר בקרוב</span>
                </div>
                <p className="text-white/90 text-lg drop-shadow-md">
                  🚀 הטבה ייחודית בדמי ההקמה למצטרפים כעת!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;