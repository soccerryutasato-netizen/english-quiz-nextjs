import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "瞬間英作文クイズ",
  description: "英語テンプレを使った瞬間英作文クイズアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-gray-50 text-gray-900" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>{children}</body>
    </html>
  );
}
