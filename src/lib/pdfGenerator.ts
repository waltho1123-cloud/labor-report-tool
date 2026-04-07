import type { CalculationResult } from "./calculator";
import { formatCurrency } from "./calculator";
import type { Nationality, ReportCategory } from "./businessCategories";
import { nationalityLabels, reportCategoryLabels } from "./businessCategories";

interface PdfInput {
  companyName: string;
  payeeName: string;
  payeeId: string;
  paymentDate: string;
  nationality: Nationality;
  reportCategory: ReportCategory;
  businessCategoryName: string;
  result: CalculationResult;
}

export async function generatePdf(input: PdfInput): Promise<void> {
  const { result } = input;

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>勞務報酬單</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif; color: #333; font-size: 11pt; line-height: 1.4; }
  .header { text-align: center; margin-bottom: 10px; }
  .header h1 { font-size: 20pt; color: #2E5FA1; margin-bottom: 2px; }
  .header .date { font-size: 9pt; color: #888; }
  .divider { border-top: 2px solid #2E5FA1; margin: 8px 0 12px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th, td { border: 1px solid #ccc; padding: 4px 10px; text-align: left; font-size: 10pt; }
  th { background: #2E5FA1; color: #fff; font-weight: bold; }
  tr:nth-child(even) td { background: #f5f5f5; }
  .label { font-weight: bold; width: 40%; }
  .amount { text-align: right; }
  .section-title { font-size: 12pt; color: #2E5FA1; font-weight: bold; margin: 10px 0 4px; }
  .highlight { background: #EBF3FB !important; font-weight: bold; font-size: 11pt; }
  .negative { color: #DC2626; }
  .signatures { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 6px; }
  .sig-box { text-align: center; width: 30%; }
  .sig-line { border-top: 1px solid #999; margin-top: 30px; padding-top: 4px; font-size: 9pt; color: #666; }
  .footer { text-align: center; margin-top: 15px; font-size: 8pt; color: #aaa; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="header">
    <h1>勞務報酬單</h1>
    <div class="date">列印日期：${new Date().toLocaleDateString("zh-TW")}</div>
  </div>
  <div class="divider"></div>

  <table>
    <thead><tr><th>項目</th><th>內容</th></tr></thead>
    <tbody>
      <tr><td class="label">公司/單位名稱</td><td>${esc(input.companyName || "（未填寫）")}</td></tr>
      <tr><td class="label">受領人姓名</td><td>${esc(input.payeeName || "（未填寫）")}</td></tr>
      <tr><td class="label">受領人身分證/統編</td><td>${esc(input.payeeId || "（未填寫）")}</td></tr>
      <tr><td class="label">付款日期</td><td>${esc(input.paymentDate || "（未填寫）")}</td></tr>
      <tr><td class="label">國籍</td><td>${esc(nationalityLabels[input.nationality])}</td></tr>
      <tr><td class="label">申報類別</td><td>${esc(reportCategoryLabels[input.reportCategory])}</td></tr>
      <tr><td class="label">執行業務類別</td><td>${esc(input.businessCategoryName || "（不適用）")}</td></tr>
    </tbody>
  </table>

  <div class="section-title">計算明細</div>
  <table>
    <thead><tr><th>項目</th><th style="text-align:right">金額</th></tr></thead>
    <tbody>
      <tr class="highlight"><td class="label">應領金額（支領金額）</td><td class="amount">${formatCurrency(result.grossAmount)}</td></tr>
      <tr><td class="label">代扣所得稅（${result.withholdingRate}%）</td><td class="amount negative">- ${formatCurrency(result.withholdingTax)}</td></tr>
      <tr><td class="label">二代健保補充保費（${result.healthInsuranceRate}%）</td><td class="amount negative">- ${formatCurrency(result.healthInsurance)}</td></tr>
      <tr class="highlight"><td class="label">實領金額</td><td class="amount" style="font-size:13pt">${formatCurrency(result.netAmount)}</td></tr>
    </tbody>
  </table>

  <div class="section-title">所得申報資訊</div>
  <table>
    <thead><tr><th>項目</th><th style="text-align:right">金額</th></tr></thead>
    <tbody>
      <tr><td class="label">所得金額</td><td class="amount">${formatCurrency(result.incomeAmount)}</td></tr>
      <tr><td class="label">費用率</td><td class="amount">${result.expenseRate}%</td></tr>
      <tr><td class="label">計入所得淨額</td><td class="amount">${formatCurrency(result.netIncome)}</td></tr>
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-box"><div class="sig-line">受領人簽章</div></div>
    <div class="sig-box"><div class="sig-line">經辦人簽章</div></div>
    <div class="sig-box"><div class="sig-line">主管簽章</div></div>
  </div>

  <div class="footer">本表由勞務報酬試算工具自動產生，僅供參考。實際扣繳金額請依國稅局規定為準。</div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("請允許彈出視窗以產生 PDF");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
