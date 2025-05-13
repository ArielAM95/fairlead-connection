
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "./components/ui/sonner";
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" closeButton richColors />
    </Router>
  );
}

export default App;
