import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
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
  return <div className="min-h-screen flex items-center relative overflow-hidden pt-20 morphing-background">
      {/* Floating organic shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-tertiary/15 rounded-full blur-2xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 pb-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div ref={elementRef} className="lg:col-span-7 staggered-animation">
            <div className="space-y-8 max-w-4xl mx-auto text-center lg:text-right">
              <h1 className="hero-text floating-element">
                oFair
              </h1>
              <div className="text-blob floating-element" style={{animationDelay: '0.5s'}}>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  כל ליד שווה לכם כסף
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  קבלו לידים איכותיים, או שתפו ותיהנו מרווח מיידי!
                </p>
              </div>
              
              <div className="text-blob floating-element" style={{animationDelay: '1s'}}>
                <p className="text-lg text-foreground leading-relaxed">
                  פלטפורמת oFair מחברת בין בעלי מקצוע מכל התחומים, ומאפשרת לכם לקבל לידים איכותיים ומפורטים, לשתף לידים שלא מתאימים לכם ולהרוויח מהם – הכול במקום אחד!
                </p>
              </div>
              
              <div className="text-blob bg-primary-gradient text-white floating-element pulsing-glow" style={{animationDelay: '1.5s'}}>
                <p className="text-xl font-bold">
                  📢 הגיע הזמן לעבוד חכם יותר ולהרוויח יותר!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center lg:justify-start floating-element" style={{animationDelay: '2s'}}>
                <Button className="bg-primary-gradient hover:shadow-glow text-white px-10 py-6 text-lg rounded-3xl transform transition-all duration-300 hover:scale-105" onClick={scrollToForm}>
                  <span>הירשמו כעת</span>
                  <ChevronRight className="mr-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="gradient-border bg-white/80 backdrop-blur-sm hover:bg-white text-primary px-10 py-6 text-lg rounded-3xl transform transition-all duration-300 hover:scale-105" onClick={scrollToWhatIs}>
                  <span>קרא עוד</span>
                </Button>
              </div>
              
              <div className="text-blob bg-secondary-gradient text-white floating-element" style={{animationDelay: '2.5s'}}>
                <p className="text-lg font-medium flex items-center justify-center lg:justify-start">
                  <span className="inline-block ml-2 text-2xl">🚀</span>
                  הטבה ייחודית בדמי ההקמה למצטרפים כעת!
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="floating-element">
              <div className="fluid-card organic-shape">
                <h3 className="text-3xl font-bold gradient-text mb-6">זה רק FAIR</h3>
                <p className="text-foreground mb-6 text-lg leading-relaxed">
                  קבלו גישה ללקוחות איכותיים, שמחפשים הצעות בצורה פשוטה וכשמתקשרים - זה כדי לסגור. שתפו לידים לא רלוונטיים עם בעלי מקצוע אחרים, הרוויחו וצרו רשת עסקית חזקה.
                </p>
                <div className="text-blob bg-accent-gradient text-white mb-6">
                  <p className="text-xl font-bold">
                    💰 אתם משלמים רק על עבודות שבוצעו!
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1 space-x-reverse">
                    <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" style={{animationDelay: '0.5s'}}></span>
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{animationDelay: '1s'}}></span>
                  </div>
                  <span className="text-primary mr-3 font-medium">עולה לאוויר בקרוב</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;