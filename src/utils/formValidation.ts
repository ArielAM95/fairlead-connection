
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Israeli phone number validation - 10 digits maximum (05XXXXXXXX or 0[2-9]XXXXXXXX)
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^0[2-9]\d{8}$/;
  return phoneRegex.test(cleanPhone) || /^05\d{8}$/.test(cleanPhone);
};

export const sanitizeEmail = (email: string): string => {
  // Strip non-Latin characters
  return email.replace(/[^\x00-\x7F]/g, "");
};

export const validateBusinessLicense = (licenseNumber: string): boolean => {
  // Remove spaces and hyphens for validation
  const cleanNumber = licenseNumber.replace(/[\s-]/g, '');
  
  // Check if exactly 9 digits
  const licenseRegex = /^\d{9}$/;
  return licenseRegex.test(cleanNumber);
};
