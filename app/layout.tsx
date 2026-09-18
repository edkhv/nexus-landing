import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

/**
 * Both families are self-hosted by `next/font` at build time: the CSS and the
 * woff2 files land in `_next/static`, so the browser never talks to Google.
 * The page is Russian, so the `cyrillic` subset is loaded alongside `latin`;
 * Manrope is a variable face, which gives the headline its 800 weight without
 * a second file.
 */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS — одно ядро для любого AI-процесса",
  description:
    "NEXUS — агентный рантайм для продуктовых команд: контекст, инструменты и проверки вокруг любой модели. Своя обвязка вместо чужого API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`h-full ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full bg-graphite-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
