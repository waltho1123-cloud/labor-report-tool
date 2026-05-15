import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "興濠工作証明產生器",
  description: "快速生成專業的工作証明文件，直接列印或匯出 PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-gray-900" style={{ background: "#f5f7fa" }}>
        <header className="bg-white border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-5">
            <Image
              src="/wiwi-logo.png"
              alt="WIWI"
              width={110}
              height={100}
              priority
              className="h-[100px] w-[110px] object-contain"
            />
            <div>
              <h1 className="text-[36px] leading-tight font-bold text-gray-900">興濠工作証明產生器</h1>
              <p className="text-[20px] text-gray-500 mt-1">快速生成專業的工作証明文件，直接列印或匯出 PDF</p>
            </div>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
