
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a href="#" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-bold text-ofair-900">oFair</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-8 md:space-x-reverse">
            <a
              href="#what-is"
              className="text-foreground/80 hover:text-ofair-900 transition-colors"
            >
              מה זה oFair?
            </a>
            <a
              href="#benefits"
              className="text-foreground/80 hover:text-ofair-900 transition-colors"
            >
              יתרונות
            </a>
            <a
              href="#problems"
              className="text-foreground/80 hover:text-ofair-900 transition-colors"
            >
              איך זה עובד?
            </a>
            <a
              href="#contact"
              className="text-foreground/80 hover:text-ofair-900 transition-colors"
            >
              צור קשר
            </a>
          </div>

          <div className="hidden md:block">
            <Button className="bg-ofair-900 hover:bg-ofair-800 text-white mr-4 button-pulse" onClick={scrollToForm}>
              <span>הירשמו כעת</span>
              <ChevronRight className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full right-0 left-0 bg-white border-t border-gray-100 shadow-md p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a
                href="#what-is"
                className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                מה זה oFair?
              </a>
              <a
                href="#benefits"
                className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                יתרונות
              </a>
              <a
                href="#problems"
                className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                איך זה עובד?
              </a>
              <a
                href="#contact"
                className="text-foreground/80 hover:text-ofair-900 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                צור קשר
              </a>
              <Button className="bg-ofair-900 hover:bg-ofair-800 text-white button-pulse w-full" onClick={scrollToForm}>
                <span>הירשמו כעת</span>
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
