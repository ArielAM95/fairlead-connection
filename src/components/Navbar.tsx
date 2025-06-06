
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const ctaSection = document.querySelector('#signup-form');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };

  return <nav className={cn("py-4 sticky top-0 z-50", scrolled ? "shadow-sm bg-white/95 backdrop-blur-sm" : "bg-white")}>
      <div className="container mx-auto md:px-6 px-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a href="#" className="flex items-center px-0">
              <img alt="oFair Logo" src="/lovable-uploads/2bc5f38c-6146-47fa-b542-6931e17357c0.png" className="h-12 w-auto object-contain" />
            </a>
          </div>

          {/* Desktop navigation - Only visible on desktop */}
          <div className="hidden md:flex md:space-x-8 md:space-x-reverse px-[33px] mx-[19px]">
            <a href="#what-is" className="text-foreground/80 hover:text-ofair-900 transition-colors">
              מה זה oFair?
            </a>
            <a href="#benefits" className="text-foreground/80 hover:text-ofair-900 transition-colors">
              יתרונות
            </a>
            <a href="#problems" className="text-foreground/80 hover:text-ofair-900 transition-colors">
              איך זה עובד?
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-ofair-900 transition-colors">
              צור קשר
            </a>
          </div>

          <div className="hidden md:block px-[2px]">
            <Button className="bg-ofair-900 hover:bg-ofair-800 text-white mr-4 button-pulse" onClick={scrollToForm}>
              <span>הירשמו כעת</span>
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
        {isOpen && <div className="md:hidden fixed top-[60px] right-0 left-0 bg-white border-t border-gray-100 shadow-md p-4 animate-fade-in z-50">
            <div className="flex flex-col space-y-4">
              <a href="#what-is" className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors" onClick={() => setIsOpen(false)}>
                מה זה oFair?
              </a>
              <a href="#benefits" className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors" onClick={() => setIsOpen(false)}>
                יתרונות
              </a>
              <a href="#problems" className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors" onClick={() => setIsOpen(false)}>
                איך זה עובד?
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors" onClick={() => setIsOpen(false)}>
                צור קשר
              </a>
              <Button className="bg-ofair-900 hover:bg-ofair-800 text-white button-pulse w-full" onClick={scrollToForm}>
                <span>הירשמו כעת</span>
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};

export default Navbar;
