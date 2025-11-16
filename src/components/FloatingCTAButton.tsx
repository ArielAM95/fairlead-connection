import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { T } from "@/components/translation/T";

const FloatingCTAButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Get the CTA section element
      const ctaSection = document.getElementById("cta");
      
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        // Hide button when CTA section is in viewport (with some margin)
        const isCtaVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(!isCtaVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSignup = () => {
    const ctaSection = document.getElementById("cta");
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      onClick={scrollToSignup}
      className={`
        fixed bottom-6 right-6 z-50
        bg-ofair-900 hover:bg-ofair-800 
        text-white font-bold
        px-6 py-6 rounded-full
        shadow-2xl hover:shadow-ofair-900/50
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0 pointer-events-none"}
        flex items-center gap-2
        group
      `}
    >
      <span className="text-lg"><T>הצטרפו עכשיו</T></span>
      <ArrowDown className="w-5 h-5 animate-bounce group-hover:animate-none" />
    </Button>
  );
};

export default FloatingCTAButton;
