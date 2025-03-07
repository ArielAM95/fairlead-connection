
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatIsSection from "@/components/WhatIsSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProblemsSection from "@/components/ProblemsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  useEffect(() => {
    document.title = "oFair - מהפכת שיתוף הלידים לבעלי מקצוע";
    
    // Track page view with Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
    
    // Log UTM parameters for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
        console.log(`UTM param found: ${key}=${value}`);
      }
    }
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <WhatIsSection />
      <HowItWorksSection />
      <CtaSection />
      <BenefitsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
