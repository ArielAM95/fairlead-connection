import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
const CtaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    const elements = sectionRef.current?.querySelectorAll(".scroll-fade");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <section className="py-16 md:py-24 cta-gradient" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white scroll-fade">
            🚀 בלעדי למצטרפים הראשונים – דמי הצטרפות מוזלים! 🚀
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto scroll-fade">
            הפלטפורמה תעלה לאוויר בעוד מספר שבועות, וכל מי שנרשם עכשיו מקבל דמי הקמה מוזלים – רק 300 ש"ח במקום 630 ש"ח!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade">
            <Button className="bg-white hover:bg-gray-100 text-ofair-900 px-8 py-6 text-lg button-pulse">
              <span>הצטרפו עכשיו</span>
              <ChevronRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/80 mt-6 scroll-fade">📲 השאירו פרטים וקחו את העסק שלכם לשלב הבא!</p>
        </div>
      </div>
    </section>;
};
export default CtaSection;