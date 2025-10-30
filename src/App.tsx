
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Registration from './pages/Registration';
import CommissionCalculator from './pages/CommissionCalculator';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/ui/WhatsAppButton';
import { Toaster } from "./components/ui/sonner";
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/commission-calculator" element={<CommissionCalculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
      <Toaster position="top-center" closeButton richColors />
    </Router>
  );
}

export default App;
