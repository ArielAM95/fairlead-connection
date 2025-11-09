export type CommissionCategory = 'A' | 'B' | 'C' | 'D_contractor' | 'D_hvac';

export interface CommissionCalculation {
  percentage: string;
  commission: number;
  netAmount: number;
  breakdown?: string;
}

export interface CommissionResultProps {
  professionLabel: string;
  amount: number;
  calculation: CommissionCalculation;
  explanation: string;
  clientRetentionDays: number;
}
