export interface CertPdfInput {
  name: string;
  gender: "男" | "女" | "";
  idNumber: string;
  income: string;
  incomeChinese: string;
  address: string;
  phone: string;
  date: string;
  signatureDataUrl: string;
  bankName: string;
  branchName: string;
  bankAccount: string;
  bankBookDataUrl: string;
  idFrontDataUrl: string;
  idBackDataUrl: string;
}

export function buildCertHtml(input: CertPdfInput): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>興濠工作証明</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif; color: #1f2937; font-size: 14pt; line-height: 1.9; }
  .page { page-break-after: always; padding: 0; }
  .page:last-child { page-break-after: auto; }
  h1.cert-title { text-align: center; font-size: 28pt; margin: 0 0 40px; letter-spacing: 8px; }
  .cert-body p { margin: 0 0 20px; }
  .blank { display: inline-block; min-width: 80px; border-bottom: 1px solid #1f2937; text-align: center; padding: 0 8px; }
  .blank-long { min-width: 180px; }
  .blank-id { min-width: 140px; font-family: monospace; }
  .blank-amount { min-width: 120px; }
  .blank-uppercase { min-width: 280px; }
  .cert-emphasis { font-weight: bold; font-size: 16pt; margin-top: 30px; }
  .meta { margin-top: 40px; }
  .meta-row { margin-bottom: 14px; }
  .signature-row { margin-top: 40px; display: flex; align-items: flex-end; gap: 12px; }
  .signature-img { max-height: 80px; max-width: 240px; }
  .signature-line { flex: 1; border-bottom: 1px solid #1f2937; height: 2px; }
  .date-row { text-align: right; margin-top: 60px; font-size: 13pt; }
  .attach-title { text-align: center; font-size: 22pt; margin: 0 0 24px; letter-spacing: 6px; }
  .attach-section { margin-bottom: 24px; }
  .attach-label { font-weight: bold; font-size: 13pt; margin-bottom: 8px; color: #374151; }
  .attach-value { font-size: 13pt; padding: 4px 0; border-bottom: 1px solid #d1d5db; }
  .attach-img { width: 100%; max-height: 220px; object-fit: contain; border: 1px solid #d1d5db; background: #f9fafb; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px; }
  .footer { text-align: center; font-size: 9pt; color: #9ca3af; margin-top: 30px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="page">
    <h1 class="cert-title">興濠工作証明</h1>
    <div class="cert-body">
      <p>
        茲証明
        <span class="blank blank-long">${esc(input.name)}</span>
        性別：<span class="blank">${esc(input.gender)}</span>
        （身份証字號：<span class="blank blank-id">${esc(input.idNumber)}</span>）
      </p>
      <p>
        因配合興濠撰寫文章至 FB 粉絲團，收入
        <span class="blank blank-amount">${esc(formatAmount(input.income))}</span>
        元，
      </p>
      <p>
        大寫：<span class="blank blank-uppercase">${esc(input.incomeChinese)}</span>。
      </p>
      <p class="cert-emphasis">特此証明！</p>
    </div>
    <div class="meta">
      <div class="meta-row">地址：<span class="blank blank-long">${esc(input.address)}</span></div>
      <div class="meta-row">電話：<span class="blank blank-long">${esc(input.phone)}</span></div>
      <div class="signature-row">
        <span>簽名：</span>
        ${input.signatureDataUrl
          ? `<img src="${input.signatureDataUrl}" class="signature-img" alt="signature" />`
          : `<span class="signature-line"></span>`}
      </div>
    </div>
    <div class="date-row">日期：${esc(input.date)}</div>
  </div>

  <div class="page">
    <h2 class="attach-title">附件資料</h2>
    <div class="attach-section grid-2">
      <div>
        <div class="attach-label">銀行名</div>
        <div class="attach-value">${esc(input.bankName) || "&nbsp;"}</div>
      </div>
      <div>
        <div class="attach-label">分行名</div>
        <div class="attach-value">${esc(input.branchName) || "&nbsp;"}</div>
      </div>
    </div>
    <div class="attach-section">
      <div class="attach-label">完整銀行帳號</div>
      <div class="attach-value">${esc(input.bankAccount) || "&nbsp;"}</div>
    </div>
    <div class="grid-3">
      <div>
        <div class="attach-label">存摺封面</div>
        ${imgOrPlaceholder(input.bankBookDataUrl)}
      </div>
      <div>
        <div class="attach-label">身份證正面</div>
        ${imgOrPlaceholder(input.idFrontDataUrl)}
      </div>
      <div>
        <div class="attach-label">身份證反面</div>
        ${imgOrPlaceholder(input.idBackDataUrl)}
      </div>
    </div>
    <div class="footer">本附件圖片已加灰色浮水印，僅供興濠工作証明使用。</div>
  </div>
</body>
</html>`;
}

export async function generateCertPdf(input: CertPdfInput): Promise<void> {
  const html = buildCertHtml(input);
  const w = window.open("", "_blank");
  if (!w) {
    alert("請允許彈出視窗以匯出 PDF");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.onload = () => w.print();
}

export function printCert(input: CertPdfInput): void {
  generateCertPdf(input);
}

function imgOrPlaceholder(src: string): string {
  if (src) return `<img src="${src}" class="attach-img" alt="attach" />`;
  return `<div class="attach-img" style="display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:11pt;">（未上傳）</div>`;
}

function formatAmount(v: string): string {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toLocaleString("zh-TW");
}

function esc(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
