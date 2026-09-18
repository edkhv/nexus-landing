import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Both families are self-hosted by `next/font` at build time: the CSS and the
 * woff2 files land in `_next/static`, so the browser never talks to Google.
 * Archivo carries a `wdth` axis, which the hero uses at 112% for its
 * expanded, engineered headline.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS — One core. Every AI workflow.",
  description:
    "NEXUS is an agentic runtime for product teams: context, tools and checks around any model.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full ${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full bg-graphite-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
