import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";

const headingPro = localFont({
  src: [
    {
      path: "../../public/fonts/heading-pro/HeadingPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/heading-pro/HeadingPro-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-heading-pro",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FormHook",
  description: "FormHook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingPro.variable} ${inter.variable} antialiased`}>
      <body className="font-heading-pro bg-background text-foreground relative tracking-tight w-full min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
