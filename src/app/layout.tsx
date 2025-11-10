import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import PWAInit from "@/components/PWAInit";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://itechsolution.com'),
  title: {
    default: "iTechSolution - Laptops, Desktops, CCTV, Printers & Accessories",
    template: "%s | iTechSolution"
  },
  description: "Buy quality new and refurbished laptops, desktops, accessories, printers, and CCTV cameras in India. Expert support available via WhatsApp +91 9545690700. Fast delivery across India.",
  keywords: ["laptops", "desktops", "CCTV cameras", "printers", "computer accessories", "refurbished laptops", "gaming laptops", "office computers", "tech store India"],
  authors: [{ name: "iTechSolution" }],
  creator: "iTechSolution",
  publisher: "iTechSolution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iTechSolution"
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://itechsolution.com',
    title: "iTechSolution - Your Trusted Tech Store in India",
    description: "Buy quality new and refurbished laptops, desktops, accessories, printers, and CCTV cameras. Expert support via WhatsApp +91 9545690700",
    siteName: "iTechSolution",
  },
  twitter: {
    card: "summary_large_image",
    title: "iTechSolution - Laptops, Desktops & Tech Products",
    description: "Quality tech products with expert support. WhatsApp us at +91 9545690700",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <CartProvider>
          <Navigation />
          {children}
          <Footer />
          <Toaster />
          <PWAInit />
        </CartProvider>
      </body>
    </html>
  );
}