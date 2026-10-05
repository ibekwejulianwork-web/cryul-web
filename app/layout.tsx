import type { Metadata } from "next";
import { Newsreader, Syne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "CRYUL",
    template: "%s · CRYUL",
  },
  description: "Il blog di CRYUL",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-body)]">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
