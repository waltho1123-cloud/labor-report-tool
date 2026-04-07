import type { Nationality, ReportCategory } from "./businessCategories";

export interface CalculationInput {
  nationality: Nationality;
  reportCategory: ReportCategory;
  amount: number; // 支領金額
  isActualReceived: boolean; // true = 實領金額, false = 應領金額
  exemptHealthInsurance: boolean; // 是否免扣二代健保
  expenseRate: number; // 費用率 (0-100)
}

export interface CalculationResult {
  grossAmount: number; // 應領金額（支領金額）
  withholdingTax: number; // 扣繳稅額
  healthInsurance: number; // 二代健保補充保費
  netAmount: number; // 實領金額
  incomeAmount: number; // 所得金額
  expenseRate: number; // 費用率
  netIncome: number; // 計入所得淨額
  withholdingRate: number; // 扣繳率
  healthInsuranceRate: number; // 健保費率
}

const HEALTH_INSURANCE_RATE = 2.11; // 2.11%
const HEALTH_INSURANCE_THRESHOLD = 29500; // 單次給付 < 29,500 元免扣
const HEALTH_INSURANCE_CAP = 10000000; // 超過 1,000 萬以 1,000 萬計算

/**
 * 取得扣繳率
 */
function getWithholdingRate(
  nationality: Nationality,
  reportCategory: ReportCategory,
  grossAmount: number
): number {
  // 外國人非居住者
  if (nationality === "foreign_non_resident") {
    if (reportCategory === "50") return 18; // 薪資 18%
    return 20; // 其他 20%
  }

  // 本國人 / 外國人居住者
  if (reportCategory === "9B") {
    // 稿費：每次給付額 ≤ 20,000 免扣繳
    if (grossAmount <= 20000) return 0;
    // 稿費 > 20,000：扣 5%
    return 5;
  }

  if (reportCategory === "50") {
    return 0; // 薪資所得不扣繳
  }

  // 9A, 92：< 20,000 免扣繳，≥ 20,000 扣 10%
  if (grossAmount < 20000) return 0;
  return 10;
}

/**
 * 取得二代健保費率
 */
function getHealthInsuranceRate(
  exemptHealthInsurance: boolean,
  grossAmount: number
): number {
  if (exemptHealthInsurance) return 0;
  if (grossAmount < HEALTH_INSURANCE_THRESHOLD) return 0;
  return HEALTH_INSURANCE_RATE;
}

/**
 * 從應領金額正算
 */
function calculateFromGross(input: CalculationInput): CalculationResult {
  const grossAmount = input.amount;
  const withholdingRate = getWithholdingRate(
    input.nationality,
    input.reportCategory,
    grossAmount
  );
  const healthInsuranceRate = getHealthInsuranceRate(
    input.exemptHealthInsurance,
    grossAmount
  );

  const withholdingTax = Math.round(grossAmount * (withholdingRate / 100));
  const healthInsuranceBase = Math.min(grossAmount, HEALTH_INSURANCE_CAP);
  const healthInsurance = Math.round(
    healthInsuranceBase * (healthInsuranceRate / 100)
  );
  const netAmount = grossAmount - withholdingTax - healthInsurance;

  const expenseRate = input.expenseRate;
  const incomeAmount = grossAmount;
  const netIncome = Math.round(grossAmount * (1 - expenseRate / 100));

  return {
    grossAmount,
    withholdingTax,
    healthInsurance,
    netAmount,
    incomeAmount,
    expenseRate,
    netIncome,
    withholdingRate,
    healthInsuranceRate,
  };
}

/**
 * 從實領金額反算應領金額
 */
function calculateFromNet(input: CalculationInput): CalculationResult {
  const netTarget = input.amount;

  // 先試算不扣繳的情況（金額 < 20,000）
  // 如果實領 < 20,000，可能應領也 < 20,000（免扣繳）
  // 但需檢查是否需扣二代健保

  // 迭代求解：找到正確的 gross 使得正算後的 netAmount === netTarget
  let grossEstimate = netTarget;
  for (let i = 0; i < 100; i++) {
    const withholdingRate = getWithholdingRate(
      input.nationality,
      input.reportCategory,
      grossEstimate
    );
    const healthInsuranceRate = getHealthInsuranceRate(
      input.exemptHealthInsurance,
      grossEstimate
    );

    let newGross: number;
    if (healthInsuranceRate > 0 && grossEstimate > HEALTH_INSURANCE_CAP) {
      // 健保費以上限 1,000 萬計算，為固定值
      const fixedHealthFee = Math.round(HEALTH_INSURANCE_CAP * (healthInsuranceRate / 100));
      newGross = Math.round((netTarget + fixedHealthFee) / (1 - withholdingRate / 100));
    } else {
      const totalDeductionRate = withholdingRate + healthInsuranceRate;
      newGross = Math.round(netTarget / (1 - totalDeductionRate / 100));
    }

    const newWithholdingRate = getWithholdingRate(
      input.nationality,
      input.reportCategory,
      newGross
    );
    const newHealthRate = getHealthInsuranceRate(
      input.exemptHealthInsurance,
      newGross
    );

    if (
      newWithholdingRate === withholdingRate &&
      newHealthRate === healthInsuranceRate
    ) {
      grossEstimate = newGross;
      break;
    }
    grossEstimate = newGross;
  }

  // 驗證正算結果，微調以消除四捨五入誤差
  let candidate = calculateFromGross({
    ...input,
    amount: grossEstimate,
    isActualReceived: false,
  });

  if (candidate.netAmount !== netTarget) {
    // 嘗試 gross +/- 1 找到精確匹配
    for (const offset of [1, -1, 2, -2]) {
      const adjusted = calculateFromGross({
        ...input,
        amount: grossEstimate + offset,
        isActualReceived: false,
      });
      if (adjusted.netAmount === netTarget) {
        candidate = adjusted;
        break;
      }
    }
  }

  return candidate;
}

/**
 * 主計算函式
 */
export function calculate(input: CalculationInput): CalculationResult {
  if (input.isActualReceived) {
    return calculateFromNet(input);
  }
  return calculateFromGross(input);
}

/**
 * 格式化金額
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
