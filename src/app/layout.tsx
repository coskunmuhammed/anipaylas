import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnıPaylaş - Etkinlik Fotoğraf Platformu",
  description: "Etkinliklerinizde QR kod ile misafir fotoğraflarını toplayın ve dijital albüm oluşturun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
