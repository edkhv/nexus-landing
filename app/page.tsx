import {
  Capabilities,
  FinalCta,
  Hero,
  SiteFooter,
  SiteHeader,
  Workflow,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Capabilities />
        <Workflow />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}