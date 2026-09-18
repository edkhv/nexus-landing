import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXUS — One core. Every AI workflow.",
  description:
    "NEXUS is an agentic runtime for product teams: context, tools and checks around any model.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-graphite-950 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}