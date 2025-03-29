import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const siteConfig = {
    name: "Booru Tag Extractor",
    description:
        "Easily extract and manage tags from popular booru image board posts (Danbooru, Gelbooru, Safebooru, Rule34, e621). Copy tags, filter by category, and view image previews.",
    url: "https://booru-tag-extractor.vercel.app",
    ogImage: "https://booru-tag-extractor.vercel.app/og-image.png",
    author: "IRedDragonICY",
    keywords: [
        "booru",
        "tags",
        "extractor",
        "danbooru",
        "gelbooru",
        "safebooru",
        "rule34",
        "e621",
        "image tags",
        "tag management",
        "copy tags",
        "tag filter",
        "anime art",
        "illustration",
        "metadata",
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),

    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: "https://x.com/ireddragonicy" }],
    creator: siteConfig.author,

    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} - OG Image`,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: `@${siteConfig.author}`,
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    applicationName: siteConfig.name,
    referrer: "origin-when-cross-origin",
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
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-on-surface`}
        >
        {children}
        </body>
        </html>
    );
}
