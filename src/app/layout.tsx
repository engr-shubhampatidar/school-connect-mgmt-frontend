import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import ClientLayoutWrapper from "../components/layout/ClientLayoutWrapper";
import { ToastProvider } from "@/components/ui";
import { QueryProvider } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AKSHAR - Management Dashboard",
  description: "Powered by Sankalp Tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <QueryProvider>
            <ToastProvider>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </ToastProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
