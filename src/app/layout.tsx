import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import { MessageCircle } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Somos Empilhadeiras",
  description: "Site Somos Empilhadeiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <a
          href="https://wa.me/62991834188"
          target="_blank"
          className="w-16 h-16 rounded-full bg-green-500 fixed bottom-5 right-5 z-200 hover:scale-105 transition-all hover:bg-green-400 flex items-center justify-center text-white shadow-lg"
        >
          <MessageCircle size={32} />
        </a>
      </body>
    </html>
  );
}
