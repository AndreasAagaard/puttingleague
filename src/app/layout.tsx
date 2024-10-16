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
      <meta name="viewport" content="width=1000" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b h-14">
            <div className="container mx-auto h-full px-4 flex justify-between items-center">
              <div className="flex items-center flex-row">
                <BackButtonComponent />
                <HomeButtonComponent />
              </div>
            </div>
          </header>
          <main className="flex-grow mt-14 px-4 py-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
