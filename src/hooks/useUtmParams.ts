
import { useState, useEffect } from 'react';

export const useUtmParams = () => {
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utmObject: Record<string, string> = {};
    
    for (const [key, value] of queryParams.entries()) {
      if (key.startsWith('utm_')) {
        utmObject[key] = value;
      }
    }
    
    setUtmParams(utmObject);
  }, []);

  return utmParams;
};
