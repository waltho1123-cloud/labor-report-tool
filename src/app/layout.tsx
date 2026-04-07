import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "勞務報酬試算工具",
  description: "自動計算扣繳稅額、二代健保補充保費，產生 PDF 勞務報酬單",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
