
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Track 404 pageview with Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="inline-block p-4 bg-ofair-100 rounded-full text-ofair-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ofair-900">404</h1>
          <p className="text-xl text-gray-600 mb-8">אופס! העמוד שחיפשת לא נמצא</p>
        </div>
        
        <Button 
          className="bg-ofair-900 hover:bg-ofair-800 text-white button-pulse"
          onClick={() => window.location.href = "/"}
        >
          <span>חזרה לעמוד הבית</span>
          <ChevronRight className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
