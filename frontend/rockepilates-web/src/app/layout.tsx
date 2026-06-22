import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Rocker Pilates",
    description: "Pilates para transformar sua rotina com consciência corporal.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="pt-BR"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
        <body className="bg-[#f5f7fa] text-[#1b2230] antialiased">
        <Navbar />
        {children}
        </body>
        </html>
    );
}