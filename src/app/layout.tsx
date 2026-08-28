import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palm Stüdyo - Dijital Anı Albümü & Etkinlik Fotoğraf Platformu",
  description: "Didim düğün & etkinlik fotoğrafçılığı, QR kod ile misafir fotoğraf toplama ve dijital albüm hizmetleri.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
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
