import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { CartProvider } from "@/src/context/CartContext";
import { RecentlyViewedProvider } from "@/src/context/RecentlyViewedContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { SearchProvider } from "@/src/context/SearchContext";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noveira-heading",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-noveira-body",
  display: "swap",
});

const siteUrl = "https://noveira.com";
const siteName = "Noveira";
const description =
  "Noveira — A modern luxury fashion house for Women, Men & Children. Considered tailoring, fine knitwear, and timeless pieces crafted to last.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Noveira — Luxury Fashion for Women, Men & Children",
    template: "%s | Noveira",
  },

  description,

  keywords: [
    "Noveira",
    "luxury fashion",
    "designer clothing Pakistan",
    "women fashion",
    "men fashion",
    "children fashion",
    "tailoring",
    "cashmere knitwear",
    "evening wear",
    "premium clothing Pakistan",
  ],

  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

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

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Noveira — Luxury Fashion for Women, Men & Children",
    description,
  },

  twitter: {
    card: "summary_large_image",
    title: "Noveira — Luxury Fashion for Women, Men & Children",
    description,
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <SearchProvider>
                <Header />
                {children}
                <Footer />
              </SearchProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
