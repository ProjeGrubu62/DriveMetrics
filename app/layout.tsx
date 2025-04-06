'use client';

import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { AuthProvider } from './providers/AuthProvider';

const geistSans = GeistSans.className;
const geistMono = GeistMono.className;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans} ${geistMono} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
