"use client";

import { useMemo, useRef, useState } from "react";
import { numberToChinese } from "@/lib/numberToChinese";
import { applyWatermark, fileToPlainDataUrl } from "@/lib/watermark";
import { generateCertPdf, type CertPdfInput } from "@/lib/pdfGenerator";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function formatAmount(v: string): string {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toLocaleString("zh-TW");
}

type Gender = "男" | "女" | "";

export default function Home() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [idNumber, setIdNumber] = useState("");
  const [income, setIncome] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(todayString);

  const [signatureDataUrl, setSignatureDataUrl] = useState("");

  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [bankBookDataUrl, setBankBookDataUrl] = useState("");
  const [idFrontDataUrl, setIdFrontDataUrl] = useState("");
  const [idBackDataUrl, setIdBackDataUrl] = useState("");

  const incomeChinese = useMemo(() => numberToChinese(income), [income]);

  const handleReset = () => {
    setName("");
    setGender("");
    setIdNumber("");
    setIncome("");
    setAddress("");
    setPhone("");
    setDate(todayString());
    setSignatureDataUrl("");
    setBankName("");
    setBranchName("");
    setBankAccount("");
    setBankBookDataUrl("");
    setIdFrontDataUrl("");
    setIdBackDataUrl("");
  };

  const buildPdfInput = (): CertPdfInput => ({
    name,
    gender,
    idNumber,
    income,
    incomeChinese,
    address,
    phone,
    date,
    signatureDataUrl,
    bankName,
    branchName,
    bankAccount,
    bankBookDataUrl,
    idFrontDataUrl,
    idBackDataUrl,
  });

  const handlePrint = () => generateCertPdf(buildPdfInput());
  const handleExportPdf = () => generateCertPdf(buildPdfInput());

  return (
    <main className="py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左：表單 */}
          <div className="space-y-6">
            <Card title="填寫個人資訊">
              <Field label="A. 姓名" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="請輸入姓名"
                  className={inputCls}
                />
              </Field>

              <Field label="B. 性別" required>
                <div className="flex gap-2">
                  <GenderButton active={gender === "男"} onClick={() => setGender("男")}>男</GenderButton>
                  <GenderButton active={gender === "女"} onClick={() => setGender("女")}>女</GenderButton>
                </div>
              </Field>

              <Field label="C. 身份証字號" required>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                  placeholder="例：A123456789"
                  className={inputCls}
                />
              </Field>

              <Field label="D. 收入" required>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={income}
                    onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="請輸入金額（整數）"
                    className={inputCls}
                  />
                  <span className="text-gray-600">元</span>
                </div>
              </Field>

              <Field label="E. 大寫（自動轉換）">
                <input
                  type="text"
                  value={incomeChinese}
                  readOnly
                  placeholder="請輸入金額"
                  className={`${inputCls} bg-gray-50 text-gray-700`}
                />
              </Field>

              <Field label="F. 地址" required>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="請輸入地址"
                  className={inputCls}
                />
              </Field>

              <Field label="G. 電話" required>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="請輸入電話號碼"
                  className={inputCls}
                />
              </Field>

              <Field label="H. 日期" required>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <SignatureUpload value={signatureDataUrl} onChange={setSignatureDataUrl} />
            </Card>

            <Card title="第二頁附件資料">
              <Field label="銀行名" required hint="請填完整的名稱">
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="例：台灣銀行"
                  className={inputCls}
                />
              </Field>

              <Field label="分行名" required hint="請填完整的名稱">
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="例：台北分行"
                  className={inputCls}
                />
              </Field>

              <Field label="銀行帳號" required>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="例：12345678"
                  className={inputCls}
                />
              </Field>

              <WatermarkedUpload
                label="存摺封面"
                value={bankBookDataUrl}
                onChange={setBankBookDataUrl}
              />
              <WatermarkedUpload
                label="身份證正面"
                value={idFrontDataUrl}
                onChange={setIdFrontDataUrl}
              />
              <WatermarkedUpload
                label="身份證反面"
                value={idBackDataUrl}
                onChange={setIdBackDataUrl}
              />
            </Card>
          </div>

          {/* 右：預覽 */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 min-h-[600px]">
              <CertPreview
                name={name}
                gender={gender}
                idNumber={idNumber}
                income={income}
                incomeChinese={incomeChinese}
                address={address}
                phone={phone}
                date={date}
                signatureDataUrl={signatureDataUrl}
                bankAccount={bankAccount}
              />
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">附件資料預覽</h3>
              <div className="grid grid-cols-3 gap-3">
                <AttachThumb label="存摺封面" src={bankBookDataUrl} />
                <AttachThumb label="身份證正面" src={idFrontDataUrl} />
                <AttachThumb label="身份證反面" src={idBackDataUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* 動作列 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handlePrint}
            className="py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <PrintIcon /> 列印
          </button>
          <button
            onClick={handleExportPdf}
            className="py-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-2"
          >
            <DownloadIcon /> 匯出 PDF
          </button>
          <button
            onClick={handleReset}
            className="py-3 rounded-lg bg-white text-red-600 border border-red-300 font-semibold hover:bg-red-50 transition"
          >
            重設
          </button>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-10 pb-6">
          本工具於本機產生文件，圖片不會上傳至任何伺服器。
        </footer>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-gray-500 ml-2">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function GenderButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
      }`}
    >
      {children}
    </button>
  );
}

function SignatureUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!/image\/(png|jpe?g)/.test(file.type)) {
      setError("僅支援 PNG / JPG 格式");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("檔案大小不可超過 5MB");
      return;
    }
    const url = await fileToPlainDataUrl(file);
    onChange(url);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">簽名圖檔</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"
        }`}
      >
        {value ? (
          <img src={value} alt="signature" className="mx-auto max-h-24 object-contain" />
        ) : (
          <div className="py-4 text-sm text-gray-500">
            <p className="font-medium text-gray-700">拖放或點擊上傳簽名</p>
            <p className="text-xs mt-1">支援 PNG、JPG 等圖片格式，檔案大小不超過 5MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          移除簽名
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function WatermarkedUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!/image\/(png|jpe?g)/.test(file.type)) {
      setError("僅支援 PNG / JPG 格式");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("檔案大小不可超過 5MB");
      return;
    }
    setProcessing(true);
    try {
      const watermarked = await applyWatermark(file);
      onChange(watermarked);
    } catch {
      setError("圖片處理失敗，請重試");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        <span className="text-xs font-normal text-gray-500 ml-2">上傳的圖片將自動添加灰色浮水印</span>
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"
        }`}
      >
        {processing ? (
          <p className="text-sm text-gray-500 py-4">處理中…</p>
        ) : value ? (
          <img src={value} alt={label} className="mx-auto max-h-32 object-contain" />
        ) : (
          <div className="py-3 text-sm text-gray-500">
            <p className="font-medium text-gray-700">拖放或點擊上傳</p>
            <p className="text-xs mt-1">支援 PNG、JPG，檔案大小不超過 5MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          移除
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function CertPreview({
  name,
  gender,
  idNumber,
  income,
  incomeChinese,
  address,
  phone,
  date,
  signatureDataUrl,
  bankAccount,
}: {
  name: string;
  gender: Gender;
  idNumber: string;
  income: string;
  incomeChinese: string;
  address: string;
  phone: string;
  date: string;
  signatureDataUrl: string;
  bankAccount: string;
}) {
  return (
    <div className="text-gray-900 leading-loose">
      <h2 className="text-2xl font-bold text-center tracking-widest mb-8">興濠工作証明</h2>

      <p className="text-base">
        茲証明 <Blank value={name} w="long" />
        性別：<Blank value={gender} />
        （身份証字號：<Blank value={idNumber} w="id" />）
      </p>

      <p className="text-base mt-3">
        因配合興濠撰寫文章至 FB 粉絲團，收入 <Blank value={formatAmount(income)} w="amount" /> 元，
      </p>
      <p className="text-base mt-3">
        大寫：<Blank value={incomeChinese} w="uppercase" />。
      </p>

      <p className="font-bold text-lg mt-6">特此証明！</p>

      <div className="mt-8 space-y-3">
        <div>地址：<Blank value={address} w="long" /></div>
        <div>電話：<Blank value={phone} w="long" /></div>
        <div className="flex items-end gap-2">
          <span>簽名：</span>
          {signatureDataUrl ? (
            <img src={signatureDataUrl} alt="signature" className="max-h-12 object-contain" />
          ) : (
            <span className="inline-block border-b border-gray-900 min-w-[160px]" />
          )}
        </div>
      </div>

      <div className="text-right mt-10 text-sm text-gray-700">
        {date && <span>日期：{date}</span>}
      </div>

      <hr className="border-t-2 border-gray-300 my-6" />

      <h3 className="text-lg font-bold text-center mb-4">附件資料</h3>
      <p className="text-sm">
        <span className="font-semibold">完整銀行帳號：</span>
        <Blank value={bankAccount} w="long" />
      </p>
    </div>
  );
}

function Blank({
  value,
  w = "default",
}: {
  value: string;
  w?: "default" | "long" | "id" | "amount" | "uppercase";
}) {
  const widthCls = {
    default: "min-w-[80px]",
    long: "min-w-[180px]",
    id: "min-w-[130px] font-mono",
    amount: "min-w-[100px]",
    uppercase: "min-w-[260px]",
  }[w];
  return (
    <span
      className={`inline-block border-b border-gray-900 text-center px-2 ${widthCls}`}
    >
      {value || " "}
    </span>
  );
}

function AttachThumb({ label, src }: { label: string; src: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="aspect-square bg-gray-50 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-contain" />
        ) : (
          <span className="text-xs text-gray-400">未上傳</span>
        )}
      </div>
    </div>
  );
}

function PrintIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
