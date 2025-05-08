
import MainCtaSection from './cta/MainCtaSection';

interface CtaSectionProps {
  showNotification?: (title: string, description: string) => void;
}

const CtaSection = ({ showNotification }: CtaSectionProps) => {
  return <MainCtaSection showNotification={showNotification} />;
};

export default CtaSection;
