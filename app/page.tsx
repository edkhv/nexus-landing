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
      {/*
        Depth layer: two very wide, very slow bodies of cyan and violet light
        behind the whole page. Purely CSS, fixed to the viewport, never hit by
        a pointer event.
      */}
      <div
        aria-hidden="true"
        className="aurora pointer-events-none fixed inset-0 z-0"
      />

      {/*
        Grain sits over the whole page at 4% and never takes a pointer event.
        It is what stops the large flat graphite fields from reading as flat
        vector fills.
      */}
      <div
        aria-hidden="true"
        className="grain pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
      />

      <SiteHeader />
      <main className="relative z-10 flex-1">
        <Hero />
        <Capabilities />
        <Workflow />
        <FinalCta />
      </main>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
