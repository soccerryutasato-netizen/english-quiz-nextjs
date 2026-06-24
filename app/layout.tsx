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
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
