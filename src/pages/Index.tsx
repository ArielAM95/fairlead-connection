
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatIsSection from "@/components/WhatIsSection";
import BusinessModelSection from "@/components/BusinessModelSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProblemsSection from "@/components/ProblemsSection";
import EarningsCalculatorSection from "@/components/EarningsCalculatorSection";
import AppShowcaseSection from "@/components/AppShowcaseSection";
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
  userName?: string;
  userPhone?: string;
  showWelcomeMessage?: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    title: "",
    description: "",
    userName: "",
    userPhone: "",
    showWelcomeMessage: false,
  });

  const showNotification = (
    title: string, 
    description: string,
    userName?: string,
    userPhone?: string,
    showWelcomeMessage?: boolean
  ) => {
    setNotification({
      isOpen: true,
      title,
      description,
      userName,
      userPhone,
      showWelcomeMessage,
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
      <EarningsCalculatorSection />
      <AppShowcaseSection />
      <WhatIsSection />
      <BusinessModelSection />
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
        userName={notification.userName}
        userPhone={notification.userPhone}
        showWelcomeMessage={notification.showWelcomeMessage}
      />
    </div>
  );
};

export default Index;
