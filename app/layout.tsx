import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import BackgroundGrid from "@/components/BackgroundGrid";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sketch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divy Yadav — AI Engineer, Technical Writer & Solopreneur",
  description:
    "AI Engineer and Technical Writer with production experience at Tensorlake and Superteams AI. Building RAG pipelines, LLM applications, and multi-agent systems. Technical content reaches 2,000+ engineers weekly.",
  keywords: [
    "AI Engineer",
    "Technical Writer",
    "RAG",
    "LangChain",
    "LangGraph",
    "Multi-Agent Systems",
    "Divy Yadav",
  ],
  authors: [{ name: "Divy Yadav" }],
  openGraph: {
    title: "Divy Yadav — AI Engineer & Technical Writer",
    description: "Building intelligent systems and writing about them for 2,000+ engineers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-96HL1LDQCY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-96HL1LDQCY');
          `}
        </Script>
        {/* Floating Ambient Glow Backgrounds */}
        <div 
          style={{
            position: 'fixed',
            top: '15%',
            left: '5%',
            width: 'min(500px, 80vw)',
            height: 'min(500px, 80vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(181, 80, 45, 0.05) 0%, rgba(245, 245, 220, 0) 70%)',
            zIndex: -2,
            pointerEvents: 'none',
            filter: 'blur(60px)',
            animation: 'floatGlow1 24s infinite alternate ease-in-out',
          }}
        />
        <div 
          style={{
            position: 'fixed',
            bottom: '10%',
            right: '2%',
            width: 'min(600px, 90vw)',
            height: 'min(600px, 90vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232, 232, 208, 0.5) 0%, rgba(245, 245, 220, 0) 75%)',
            zIndex: -2,
            pointerEvents: 'none',
            filter: 'blur(70px)',
            animation: 'floatGlow2 28s infinite alternate ease-in-out',
          }}
        />
        <div 
          style={{
            position: 'fixed',
            top: '55%',
            left: '45%',
            width: 'min(400px, 60vw)',
            height: 'min(400px, 60vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 168, 83, 0.04) 0%, rgba(245, 245, 220, 0) 70%)',
            zIndex: -2,
            pointerEvents: 'none',
            filter: 'blur(50px)',
            animation: 'floatGlow3 20s infinite alternate ease-in-out',
          }}
        />

        <CustomCursor />
        <SmoothScroll />
        <BackgroundGrid />
        <Nav />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
