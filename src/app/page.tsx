"use client";

import { useState, useMemo } from "react";
import {
  type Nationality,
  type ReportCategory,
  nationalityLabels,
  reportCategoryLabels,
  businessCategories9A,
} from "@/lib/businessCategories";
import { calculate, type CalculationInput } from "@/lib/calculator";
import { generatePdf } from "@/lib/pdfGenerator";

function getLocalDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Home() {
  const [nationality, setNationality] = useState<Nationality>("local");
  const [exemptHealthInsurance, setExemptHealthInsurance] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory>("50");
  const [businessCategoryCode, setBusinessCategoryCode] = useState("39");
  const [amount, setAmount] = useState("");
  const [isActualReceived, setIsActualReceived] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [payeeId, setPayeeId] = useState("");
  const [paymentDate, setPaymentDate] = useState(getLocalDateString);

  const selectedCategory = businessCategories9A.find(
    (c) => c.code === businessCategoryCode
  );

  const expenseRate = useMemo(() => {
    if (reportCategory === "9A") return selectedCategory?.rate ?? 0;
    if (reportCategory === "9B") return 30;
    return 0;
  }, [reportCategory, selectedCategory]);

  const parsedAmount = parseFloat(amount) || 0;

  const result = useMemo(() => {
    if (parsedAmount <= 0) return null;
    const input: CalculationInput = {
      nationality,
      reportCategory,
      amount: parsedAmount,
      isActualReceived,
      exemptHealthInsurance,
      expenseRate,
    };
    return calculate(input);
  }, [nationality, reportCategory, parsedAmount, isActualReceived, exemptHealthInsurance, expenseRate]);

  const handleExportPdf = async () => {
    if (!result) return;
    await generatePdf({
      companyName,
      payeeName,
      payeeId,
      paymentDate,
      nationality,
      reportCategory,
      businessCategoryName: reportCategory === "9A" ? selectedCategory?.name ?? "" : "",
      result,
    });
  };

  const handleReset = () => {
    setNationality("local");
    setExemptHealthInsurance(false);
    setReportCategory("50");
    setBusinessCategoryCode("39");
    setAmount("");
    setIsActualReceived(false);
    setCompanyName("");
    setPayeeName("");
    setPayeeId("");
    setPaymentDate(getLocalDateString());
  };

  return (
    <main className="flex-1 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">勞務報酬試算工具</h1>
          <p className="text-gray-500 mt-2">
            自動計算扣繳稅額、二代健保補充保費，產生 PDF 勞務報酬單
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 國籍 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">國籍</label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value as Nationality)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(nationalityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* 是否免扣二代健保 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">是否免扣二代健保</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="healthInsurance"
                  checked={!exemptHealthInsurance}
                  onChange={() => setExemptHealthInsurance(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">否（非職業工會/專技人員）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="healthInsurance"
                  checked={exemptHealthInsurance}
                  onChange={() => setExemptHealthInsurance(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">是（職業工會/專技人員自行執業）</span>
              </label>
            </div>
          </div>

          {/* 申報類別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">申報類別</label>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value as ReportCategory)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(reportCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* 執行業務類別 (9A only) */}
          {reportCategory === "9A" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                執行業務類別（費用率：{expenseRate}%）
              </label>
              <select
                value={businessCategoryCode}
                onChange={(e) => setBusinessCategoryCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {businessCategories9A.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name}（費用率 {cat.rate}%）
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportCategory === "9B" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              稿費固定費用率：30%（定額免稅額 NT$180,000/年）
            </div>
          )}

          {/* 支領金額 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">支領金額（新台幣）</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">NT$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="請輸入金額"
                min="0"
                className="w-full rounded-lg border border-gray-300 pl-14 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 實領 checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActualReceived}
                onChange={(e) => setIsActualReceived(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">此金額為實領金額（系統將反算應領金額）</span>
            </label>
          </div>

          {/* 計算結果 — 嵌入表單內 */}
          {result && (
            <div className="space-y-4 pt-2">
              <SummaryRow label="支領金額:" value={result.grossAmount} />
              <SummaryRow label="代扣所得金額:" value={result.withholdingTax} />
              <SummaryRow label="二代健保:" value={result.healthInsurance} />
              <div className="border-t-2 border-blue-400 my-2" />
              <SummaryRow label="實際支付金額:" value={result.netAmount} bold />

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-3">補充：對所得人個人所得的影響</p>
                <SummaryRow label="所得金額:" value={result.incomeAmount} />
                <SummaryRow label="費用率:" suffix={`${result.expenseRate}%`} />
                <div className="border-t-2 border-blue-400 my-2" />
                <SummaryRow label="計入所得淨額:" value={result.netIncome} bold />
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            重新填寫
          </button>
        </div>

        {/* PDF 匯出 */}
        {result && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">匯出 PDF 勞務報酬單</h2>
            <p className="text-sm text-gray-500 mb-4">填寫以下資訊後匯出完整的勞務報酬單 PDF（選填）</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">公司/單位名稱</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="例：OO有限公司"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">受領人姓名</label>
                <input type="text" value={payeeName} onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="例：王小明"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">受領人身分證/統編</label>
                <input type="text" value={payeeId} onChange={(e) => setPayeeId(e.target.value)}
                  placeholder="例：A123456789"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">付款日期</label>
                <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <button
              onClick={handleExportPdf}
              className="w-full py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下載 PDF 勞務報酬單
            </button>
          </div>
        )}

        <footer className="text-center text-xs text-gray-400 mt-8 pb-6">
          <p>本工具僅供試算參考，實際扣繳金額請依國稅局規定為準</p>
          <p className="mt-1">二代健保補充保費費率：2.11%（2024年起適用）</p>
        </footer>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, suffix, bold }: {
  label: string; value?: number; suffix?: string; bold?: boolean;
}) {
  const display = suffix ?? `${(value ?? 0).toLocaleString("zh-TW")} 元`;
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className={`${bold ? "text-lg font-bold text-gray-900" : "text-base text-gray-700"}`}>{label}</span>
      <span className={`${bold ? "text-xl font-bold text-gray-900" : "text-base text-gray-800"}`}>{display}</span>
    </div>
  );
}
