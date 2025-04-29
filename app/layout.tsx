import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { Metadata } from "next";
import Header from "./components/Header";

const geistSans = GeistSans.className;
const geistMono = GeistMono.className;

export const metadata: Metadata = {
  title: "DriveMetrics",
  description: "Track and analyze your driving metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans} ${geistMono} antialiased min-h-screen bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
