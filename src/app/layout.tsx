import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BackButtonComponent } from "@/components/back-button";
import { HomeButtonComponent } from "@/components/home-button";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PuttingLeague",
  description: "App til scorekeeping til putting league",
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
        <BackButtonComponent />
        <HomeButtonComponent />
        {children}
      </body>
    </html>
  );
}
