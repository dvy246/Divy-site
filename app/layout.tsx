import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <CustomCursor />
        <SmoothScroll />
        <Nav />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
