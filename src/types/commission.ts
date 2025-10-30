export interface CommissionCalculation {
  percentage: string;
  commission: number;
  netAmount: number;
  breakdown?: string;
}

export interface CommissionInfo {
  professionId: string;
  professionLabel: string;
  category: 'A' | 'B' | 'C' | 'D';
  calculateCommission: (amount: number) => CommissionCalculation;
  explanation: string;
  clientRetentionDays: 30 | 60 | 180;
}

export interface CommissionResultProps {
  professionLabel: string;
  amount: number;
  calculation: CommissionCalculation;
  explanation: string;
  clientRetentionDays: number;
}
