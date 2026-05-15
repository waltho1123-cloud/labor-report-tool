export async function applyWatermark(
  file: File,
  text = "僅供興濠工作証明使用"
): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  const maxDim = 1600;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);

  const today = new Date();
  const stamp = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;
  const fullText = `${text}  ${stamp}`;

  const fontSize = Math.max(16, Math.round(Math.min(w, h) / 22));
  ctx.font = `bold ${fontSize}px "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif`;
  ctx.fillStyle = "rgba(120, 120, 120, 0.38)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 6);

  const stepX = Math.max(fontSize * 14, 240);
  const stepY = Math.max(fontSize * 4, 100);
  const diag = Math.sqrt(w * w + h * h);
  for (let y = -diag; y < diag; y += stepY) {
    for (let x = -diag; x < diag; x += stepX) {
      ctx.fillText(fullText, x, y);
    }
  }
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.85);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

export async function fileToPlainDataUrl(file: File): Promise<string> {
  return fileToDataUrl(file);
}
