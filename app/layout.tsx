"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "@/component/GlobalSpeedDial" // Opsional jika tidak dipakai
import GlobalSpeedDial from "@/component/GlobalSpeedDial";
// 1. IMPORT ProfileButton

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {children}
        

        <GlobalSpeedDial/>

      </body>
    </html>
  );
}