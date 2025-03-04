
/**
 * Extracts UTM parameters from the current URL
 * @returns An object containing all UTM parameters
 */
export const getUtmParams = (): Record<string, string> => {
  const queryParams = new URLSearchParams(window.location.search);
  const utmObject: Record<string, string> = {};
  
  // Extract all UTM parameters
  for (const [key, value] of queryParams.entries()) {
    if (key.startsWith('utm_')) {
      utmObject[key] = value;
    }
  }
  
  return utmObject;
};

/**
 * Adds UTM parameters to a data object for API submission
 * @param data The original data object
 * @returns The data object with UTM parameters added
 */
export const appendUtmParams = <T extends Record<string, any>>(data: T): T & Record<string, string> => {
  const utmParams = getUtmParams();
  return {
    ...data,
    ...utmParams
  };
};
