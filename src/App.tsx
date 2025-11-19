
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Registration from './pages/Registration';
import CommissionCalculator from './pages/CommissionCalculator';
import ThankYou from './pages/ThankYou';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/ui/WhatsAppButton';
import { Toaster } from "./components/ui/sonner";
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/commission-calculator" element={<CommissionCalculator />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <Toaster position="top-center" closeButton richColors />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
