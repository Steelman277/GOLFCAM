import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import { AppContextProvider } from "@/context/AppContext";
import Sidebar from "@/components/app/SideBar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABACUS",
  description: "Scouting App for FIRST Age - Rebuilt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
          <AppContextProvider>
          <main>
            {children}
          </main>
          </AppContextProvider>
      </body>
    </html>
  );
}
