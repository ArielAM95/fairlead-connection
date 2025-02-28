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
  return <div className="min-h-screen flex items-center relative overflow-hidden pt-20 hero-gradient">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -bottom-56 -left-56 w-96 h-96 bg-ofair-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-32 -right-40 w-80 h-80 bg-ofair-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 pb-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div ref={elementRef} className="lg:col-span-7 staggered-animation">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                oFair – הצטרפו למהפכת שיתוף הלידים וניהול הפרויקטים לבעלי מקצוע!
              </h1>
              <p className="text-xl text-muted-foreground">פלטפורמת oFair מחברת בין בעלי מקצוע בתחומי הבנייה, השיפוצים וההנדסה, ומאפשרת לכם לקבל לידים איכותיים ומפורטים, לשתף לידים שלא מתאימים לכם ולהתחבר לפרויקטים רלוונטיים – הכול במקום אחד!</p>
              <p className="text-xl font-semibold text-ofair-900">
                📢 הגיע הזמן לעבוד חכם יותר ולהרוויח יותר!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-ofair-900 hover:bg-ofair-800 text-white px-8 py-6 text-lg button-pulse" onClick={scrollToForm}>
                  <span>הירשמו כעת</span>
                  <ChevronRight className="mr-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-ofair-200 hover:bg-ofair-50 text-ofair-900 px-8 py-6 text-lg">
                  <span>קרא עוד</span>
                </Button>
              </div>
              
              <div className="pt-6">
                <p className="text-muted-foreground flex items-center">
                  <span className="inline-block ml-2 text-ofair-900 font-semibold">🚀</span>
                  בלעדי למצטרפים הראשונים – דמי הצטרפות מוזלים!
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-ofair-100 to-ofair-50 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-morphism rounded-2xl p-8 max-w-md">
                  <h3 className="text-2xl font-bold text-ofair-900 mb-4">זה רק FAIR</h3>
                  <p className="text-foreground mb-4">קבלו גישה ללקוחות איכותיים, שמחפשים הצעות בצורה פשוטה וכשמתקשרים - זה כדי לסגור.
שתפו לידים לא רלוונטיים עם בעלי מקצוע אחרים, הרוויחו וצרו רשת עסקית חזקה.</p>
                  <div className="flex items-center text-sm">
                    <div className="flex space-x-1 space-x-reverse">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-green-600 mr-2">עולה לאוויר בקרוב</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;