import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SalonyAI - Dynamic Website",
  description: "Dynamic multi-tenant website powered by SalonyAI",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/SalonyAI-Icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/SalonyAI-Icon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/SalonyAI-Icon.png',
    other: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', url: '/SalonyAI-Icon.png' },
      { rel: 'icon', url: '/SalonyAI-Icon.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/SalonyAI-Icon.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/SalonyAI-Icon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/SalonyAI-Icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
