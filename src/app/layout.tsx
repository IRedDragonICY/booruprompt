import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "./providers/LanguageProvider";
import { StructuredData } from "@/components/StructuredData";
import { LanguageHtmlWrapper } from "@/components/LanguageHtmlWrapper";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo/metadata";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    ...generateSeoMetadata('en', { path: '/' }),
    title: {
        default: "Booru Tag Extractor",
        template: `%s | Booru Tag Extractor`,
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        shortcut: "/icon.svg",
        apple: "/icon.svg",
    },
    manifest: '/manifest.webmanifest',
    applicationName: "Booru Tag Extractor",
    referrer: "origin-when-cross-origin",
    other: {
        'google-site-verification': 'SeU7j1p_RghwijQK39HcGyU9L5su7-xhodHrPXhE2Xs'
    }
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <StructuredData locale="en" type="webApplication" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-on-surface`}
        >
        <LanguageProvider>
            <LanguageHtmlWrapper />
            {children}
            <Analytics />
        </LanguageProvider>
        </body>
        </html>
    );
}
