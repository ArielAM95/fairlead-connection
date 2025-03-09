
import { useEffect, useState } from "react";
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
import NotificationPopup from "@/components/ui/NotificationPopup";

// Define the notification context to be used across components
export interface NotificationState {
  isOpen: boolean;
  title: string;
  description: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const showNotification = (title: string, description: string) => {
    setNotification({
      isOpen: true,
      title,
      description,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
};

const Index = () => {
  const { notification, showNotification, hideNotification } = useNotification();
  
  useEffect(() => {
    document.title = "oFair - מהפכת שיתוף הלידים לבעלי מקצוע";
    
    // Track page view with Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
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
      <CtaSection showNotification={showNotification} />
      <BenefitsSection />
      <ContactSection showNotification={showNotification} />
      <Footer />
      <ScrollToTop />
      <NotificationPopup
        title={notification.title}
        description={notification.description}
        isOpen={notification.isOpen}
        onClose={hideNotification}
      />
    </div>
  );
};

export default Index;
