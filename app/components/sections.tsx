import AiCoreCanvas from "./ai-core-canvas";

/* --------------------------------------------------------------- header -- */

function CoreMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 place-items-center rounded-md border border-graphite-600 bg-graphite-900"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <circle cx="12" cy="12" r="3.4" fill="#3fe0ff" />
        <circle
          cx="12"
          cy="12"
          r="7.6"
          stroke="#8b7cf6"
          strokeWidth="1.1"
          opacity="0.85"
        />
        <circle
          cx="12"
          cy="12"
          r="10.4"
          stroke="#3fe0ff"
          strokeWidth="0.9"
          opacity="0.35"
        />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-graphite-800/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.22em] text-slate-100 uppercase"
        >
          <CoreMark />
          Nexus
        </a>

        <nav aria-label="Sections" className="flex items-center gap-5">
          <a
            href="#workflow"
            className="hidden font-mono text-xs tracking-[0.16em] text-slate-400 uppercase transition-colors hover:text-cyan-electric sm:inline"
          >
            Workflow
          </a>
          <a
            href="#demo"
            className="rounded-full border border-cyan-electric/40 px-4 py-2 font-mono text-xs tracking-[0.16em] text-cyan-electric uppercase transition-colors hover:border-cyan-electric hover:bg-cyan-electric/10"
          >
            Launch the demo
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- hero -- */

function CtaButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <a
        href="#demo"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-electric px-6 py-3 text-sm font-semibold text-graphite-950 transition-colors hover:bg-cyan-electric/85"
      >
        Launch the demo
        <span aria-hidden="true">→</span>
      </a>
      <a
        href="#workflow"
        className="inline-flex items-center justify-center rounded-full border border-graphite-600 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
      >
        See the workflow
      </a>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-graphite-800/80"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(120% 90% at 50% 30%, black, transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2 lg:gap-6 lg:py-0">
        {/* Text first in the DOM, so 390 px shows copy and CTA before 3D. */}
        <div className="flex flex-col items-start gap-6 lg:py-24">
          <p className="font-mono text-[0.7rem] tracking-[0.32em] text-cyan-electric uppercase">
            Agentic runtime
          </p>

          <h1 className="max-w-[16ch] text-4xl leading-[1.05] font-semibold tracking-tight text-slate-50 text-balance sm:text-5xl lg:text-6xl">
            One core. Every AI workflow.
          </h1>

          <p className="max-w-[42ch] text-lg leading-relaxed text-slate-400 text-pretty">
            Context, tools and checks around any model.
          </p>

          <CtaButtons />

          <dl className="mt-2 grid w-full max-w-md grid-cols-1 gap-x-6 gap-y-3 border-t border-graphite-800 pt-6 font-mono text-[0.7rem] tracking-[0.14em] text-slate-500 uppercase sm:grid-cols-3">
            <div>
              <dt className="text-slate-600">Models</dt>
              <dd className="text-slate-300">Any provider</dd>
            </div>
            <div>
              <dt className="text-slate-600">Tools</dt>
              <dd className="text-slate-300">Scoped</dd>
            </div>
            <div>
              <dt className="text-slate-600">Checks</dt>
              <dd className="text-slate-300">Enforced</dd>
            </div>
          </dl>
        </div>

        <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[560px]">
          <AiCoreCanvas />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- capabilities -- */

const CAPABILITIES = [
  {
    index: "01",
    title: "Model-agnostic core",
    body: "Point NEXUS at any provider. Context, tools and checks stay put while the model underneath changes.",
  },
  {
    index: "02",
    title: "Tools with permissions",
    body: "Every tool call carries a scope, a budget and a full trace, so agents act without holding production keys.",
  },
  {
    index: "03",
    title: "Checks before ship",
    body: "Evals, guardrails and replay run on each change, so a regression never reaches a user unnoticed.",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="border-b border-graphite-800/80"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="capabilities-title"
            className="max-w-[24ch] text-2xl font-semibold tracking-tight text-slate-100 text-balance sm:text-3xl"
          >
            Three things the runtime owns for you.
          </h2>
          <p className="max-w-[46ch] font-mono text-xs leading-relaxed tracking-[0.12em] text-slate-500 uppercase">
            One runtime between your product and every model
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-14">
          {CAPABILITIES.map((item) => (
            <li
              key={item.index}
              className="group relative rounded-2xl border border-graphite-700 bg-graphite-850/70 p-6 transition-colors hover:border-cyan-electric/35"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-cyan-electric/50 via-violet-soft/30 to-transparent"
              />
              <p className="font-mono text-[0.7rem] tracking-[0.24em] text-cyan-electric">
                {item.index}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- workflow -- */

const WORKFLOW = [
  {
    step: "01",
    title: "Connect",
    body: "Bring model keys and data sources into one runtime.",
  },
  {
    step: "02",
    title: "Compose",
    body: "Wire context, tools and checks into a single workflow.",
  },
  {
    step: "03",
    title: "Observe",
    body: "Replay every run with traces, cost and tool history.",
  },
  {
    step: "04",
    title: "Ship",
    body: "Promote the workflow behind one stable endpoint.",
  },
];

export function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="border-b border-graphite-800/80"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <h2
          id="workflow-title"
          className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl"
        >
          From keys to production in four steps.
        </h2>

        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-graphite-700 bg-graphite-700 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {WORKFLOW.map((item) => (
            <li key={item.step} className="bg-graphite-850/90 p-6">
              <p className="font-mono text-[0.7rem] tracking-[0.24em] text-violet-soft">
                {item.step}
              </p>
              <h3 className="mt-4 text-base font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ final cta -- */

export function FinalCta() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="relative">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-graphite-700 bg-graphite-900 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-cyan-deep/30 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-violet-deep/30 blur-[80px]"
          />

          <div className="relative flex flex-col items-start gap-6">
            <p className="font-mono text-[0.7rem] tracking-[0.32em] text-cyan-electric uppercase">
              Product demo
            </p>
            <h2
              id="demo-title"
              className="max-w-[20ch] text-3xl font-semibold tracking-tight text-slate-50 text-balance sm:text-4xl"
            >
              See the core run a workflow end to end.
            </h2>
            <p className="max-w-[52ch] text-base leading-relaxed text-slate-400">
              Open the sample workspace: connect a model, attach two tools and
              watch the checks run before anything ships.
            </p>
            <CtaButtons />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- footer -- */

export function SiteFooter() {
  return (
    <footer className="border-t border-graphite-800/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-500 uppercase">
          NEXUS — agentic runtime for product teams
        </p>
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-600 uppercase">
          Fictional product · demo page
        </p>
      </div>
    </footer>
  );
}