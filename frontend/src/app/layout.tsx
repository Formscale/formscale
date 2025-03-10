import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const headingPro = localFont({
  src: [
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/heading-pro/HeadingPro-ExtraBoldItalic.ttf",
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
  title: "Formscale - Create & Manage Custom Forms",
  description:
    "Build forms in minutes with Formscale, from static sites to full-stack-apps, with minimal code. The best form builder for websites, apps, and businesses of all sizes.",
  keywords: ["form builder", "custom forms", "form management", "online forms", "form creation tool"],
  openGraph: {
    title: "Formscale - Create & Manage Custom Forms | The Most Powerful Form Builder",
    description:
      "Build and manage scalable forms in minutes with Formscale. The most powerful form builder for websites, apps, and businesses of all sizes.",
    url: "https://formscale.dev",
    siteName: "Formscale",
    images: [
      {
        url: "https://formscale.dev/assets/images/formscale-og.png",
        width: 1200,
        height: 630,
        alt: "Formscale - The Most Powerful Form Builder & Management Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formscale - Create & Manage Custom Forms",
    description: "Build and manage scalable forms in minutes with Formscale.",
    images: ["https://formscale.dev/assets/images/formscale-og.png"],
  },
};

// export const runtime = "edge";

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
