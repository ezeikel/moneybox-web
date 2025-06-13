import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import Header from "@/components/Header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moneybox",
  description: "Moneybox Technical Task",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-(family-name:--font-poppins) antialiased flex flex-col">
        <Header />
        <main className="flex flex-col min-h-[calc(100vh-72px)] [&>div]:flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
