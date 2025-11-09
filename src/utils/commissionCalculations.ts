export type CommissionCategory = 'A' | 'B' | 'C' | 'D_contractor' | 'D_hvac';

export interface CommissionResult {
  percentage: string;
  commission: number;
  netAmount: number;
  breakdown?: string;
}

export const calculateCommission = (
  category: CommissionCategory,
  amount: number
): CommissionResult => {
  switch (category) {
    case 'A':
      return calculateFixed10(amount);
    case 'B':
      return calculateTiered5000(amount);
    case 'C':
      return calculateTiered1000(amount);
    case 'D_contractor':
      return calculateContractor(amount);
    case 'D_hvac':
      return calculateHVAC(amount);
    default:
      return calculateFixed10(amount);
  }
};

// A: 10% קבוע
const calculateFixed10 = (amount: number): CommissionResult => {
  const commission = amount * 0.1;
  return {
    percentage: "10%",
    commission,
    netAmount: amount - commission,
  };
};

// B: 10% עד 5,000 | 5% מעל 5,001
const calculateTiered5000 = (amount: number): CommissionResult => {
  if (amount <= 5000) {
    const commission = amount * 0.1;
    return {
      percentage: "10%",
      commission,
      netAmount: amount - commission,
    };
  }
  
  const firstTier = 5000 * 0.1; // 500
  const secondTier = (amount - 5000) * 0.05;
  const commission = firstTier + secondTier;
  
  return {
    percentage: "10% + 5%",
    commission,
    netAmount: amount - commission,
    breakdown: `עד 5,000 ₪: 500 ₪ (10%) + מעל 5,001 ₪: ${secondTier.toFixed(2)} ₪ (5%)`,
  };
};

// C: 10% עד 1,000 | 5% מעל 1,001
const calculateTiered1000 = (amount: number): CommissionResult => {
  if (amount <= 1000) {
    const commission = amount * 0.1;
    return {
      percentage: "10%",
      commission,
      netAmount: amount - commission,
    };
  }
  
  const firstTier = 1000 * 0.1; // 100
  const secondTier = (amount - 1000) * 0.05;
  const commission = firstTier + secondTier;
  
  return {
    percentage: "10% + 5%",
    commission,
    netAmount: amount - commission,
    breakdown: `עד 1,000 ₪: 100 ₪ (10%) + מעל 1,001 ₪: ${secondTier.toFixed(2)} ₪ (5%)`,
  };
};

// D_contractor: 5% עד 100,000 | 2% מעל 100,001
const calculateContractor = (amount: number): CommissionResult => {
  if (amount <= 100000) {
    const commission = amount * 0.05;
    return {
      percentage: "5%",
      commission,
      netAmount: amount - commission,
    };
  }
  
  const firstTier = 100000 * 0.05; // 5,000
  const secondTier = (amount - 100000) * 0.02;
  const commission = firstTier + secondTier;
  
  return {
    percentage: "5% + 2%",
    commission,
    netAmount: amount - commission,
    breakdown: `עד 100,000 ₪: 5,000 ₪ (5%) + מעל 100,001 ₪: ${secondTier.toFixed(2)} ₪ (2%)`,
  };
};

// D_hvac: 8% עד 2,000 | 2% מעל 2,001
const calculateHVAC = (amount: number): CommissionResult => {
  if (amount <= 2000) {
    const commission = amount * 0.08;
    return {
      percentage: "8%",
      commission,
      netAmount: amount - commission,
    };
  }
  
  const firstTier = 2000 * 0.08; // 160
  const secondTier = (amount - 2000) * 0.02;
  const commission = firstTier + secondTier;
  
  return {
    percentage: "8% + 2%",
    commission,
    netAmount: amount - commission,
    breakdown: `עד 2,000 ₪: 160 ₪ (8%) + מעל 2,001 ₪: ${secondTier.toFixed(2)} ₪ (2%)`,
  };
};
