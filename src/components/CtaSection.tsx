
import MainCtaSection from './cta/MainCtaSection';

interface CtaSectionProps {
  showNotification?: (
    title: string, 
    description: string, 
    userName?: string, 
    userPhone?: string, 
    showWelcomeMessage?: boolean
  ) => void;
}

const CtaSection = ({ showNotification }: CtaSectionProps) => {
  return <MainCtaSection showNotification={showNotification} />;
};

export default CtaSection;
