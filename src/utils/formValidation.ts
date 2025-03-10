
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Simple Israeli phone number validation
  const phoneRegex = /^0[2-9]\d{7,8}$/;
  return phoneRegex.test(phone.replace(/-/g, ''));
};

export const sanitizeEmail = (email: string): string => {
  // Strip non-Latin characters
  return email.replace(/[^\x00-\x7F]/g, "");
};
