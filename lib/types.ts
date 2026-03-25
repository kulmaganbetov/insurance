export interface FormData {
  name?: string;
  age: number;
  gender: string;
  region: string;
  height: number;
  weight: number;
  diseases: string[];
  systolic: number;
  diastolic: number;
  smoking: string;
  alcohol: string;
  activity: string;
  heredity: string[];
  insuranceType: string;
  term: number;
  insuranceSum: number;
  goal: string;
}

export interface CalculationResult {
  client_summary: {
    age: number;
    gender: string;
    region: string;
    insurance_type: string;
    insurance_term: number;
    insurance_sum: number;
  };
  actuarial_calculation: {
    lx: number;
    lx_n: number;
    Dx: number;
    Dx_n: number;
    Nx: number;
    Nx_n: number;
    Mx: number;
    base_net_tariff: number;
    base_tariff_type: string;
  };
  risk_factors: Array<{
    factor: string;
    adjustment: string;
  }>;
  risk_calculation: {
    base_tariff: number;
    total_adjustment_coefficient: number;
    adjusted_net_tariff: number;
    gross_tariff: number;
    risk_level: string;
    risk_score: number;
  };
  premium: {
    annual_premium_per_1000: number;
    annual_premium_tenge: number;
    monthly_premium_tenge: number;
    one_time_premium_tenge: number;
  };
  life_expectancy_estimate: {
    base_kazakhstan: number;
    gender_adjusted: number;
    personal_adjusted: number;
    adjustment_explanation: string;
  };
  recommendations: string[];
  comparison_traditional: {
    traditional_tariff: number;
    ai_adjusted_tariff: number;
    difference_percent: number;
    explanation: string;
  };
}
