
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSelector } from "@/components/translation/LanguageSelector";
import { T } from "@/components/translation/T";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    const ctaSection = document.querySelector('#cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };

  return <nav className={cn("py-4 sticky top-0 z-50", scrolled ? "shadow-sm bg-card/80 backdrop-blur-md" : "bg-transparent")}>
      <div className="container mx-auto md:px-6 px-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a href="#" className="flex items-center px-0">
              <img alt="oFair Logo" src="/lovable-uploads/ofair-logo.png" className="h-24 w-auto object-contain" />
            </a>
          </div>

          {/* Desktop navigation - Only visible on desktop */}
          <div className="hidden md:flex md:space-x-8 md:space-x-reverse px-[33px] mx-[19px]">
            <a href="#what-is" className="text-foreground/80 hover:text-primary transition-colors">
              <T>מה זה oFair?</T>
            </a>
            <a href="#benefits" className="text-foreground/80 hover:text-primary transition-colors">
              <T>יתרונות</T>
            </a>
            <a href="#problems" className="text-foreground/80 hover:text-primary transition-colors">
              <T>איך זה עובד?</T>
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">
              <T>צור קשר</T>
            </a>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4 px-[2px]">
            <LanguageSelector />
            <Button className="cta-gradient text-white button-pulse" onClick={scrollToForm}>
              <T>הירשמו כעת</T>
              <ChevronRight className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button - Only visible on mobile */}
          <div className="flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2" aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu - Only visible when toggled on mobile */}
        {isOpen && <div className="md:hidden fixed top-[60px] right-0 left-0 bg-card/95 backdrop-blur-md border-t border-border shadow-md p-4 animate-fade-in z-50">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end">
                <LanguageSelector />
              </div>
              <a href="#what-is" className="text-foreground/80 hover:text-primary py-2 transition-colors" onClick={() => setIsOpen(false)}>
                <T>מה זה oFair?</T>
              </a>
              <a href="#benefits" className="text-foreground/80 hover:text-primary py-2 transition-colors" onClick={() => setIsOpen(false)}>
                <T>יתרונות</T>
              </a>
              <a href="#problems" className="text-foreground/80 hover:text-primary py-2 transition-colors" onClick={() => setIsOpen(false)}>
                <T>איך זה עובד?</T>
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-primary py-2 transition-colors" onClick={() => setIsOpen(false)}>
                <T>צור קשר</T>
              </a>
              <Button className="cta-gradient text-white button-pulse w-full" onClick={scrollToForm}>
                <T>הירשמו כעת</T>
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};

export default Navbar;
