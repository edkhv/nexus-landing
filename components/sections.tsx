import type { CSSProperties, ReactNode } from "react";
import AiCoreCanvas from "./ai-core-canvas";

/* ------------------------------------------------------------- helpers -- */

/** Stagger hooks handed to the CSS in `globals.css` as custom properties. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Per-element offset into the scroll-driven reveal range. */
const range = (from: number, to: number) =>
  ({ "--rs": `${from}%`, "--re": `${to}%` }) as CSSProperties;

const CORNERS = [
  "top-0 left-0",
  "top-0 right-0",
  "bottom-0 left-0",
  "bottom-0 right-0",
] as const;

/** Registration crosses at the four corners of a panel — surveyor's marks. */
function Crosshairs({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`absolute ${corner} grid h-2.5 w-2.5 place-items-center`}
        >
          <span className="absolute h-2.5 w-px bg-graphite-600" />
          <span className="absolute h-px w-2.5 bg-graphite-600" />
        </span>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- header -- */

function CoreMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 place-items-center rounded-[5px] border border-graphite-600 bg-graphite-900"
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

/** Thin telemetry strip: sets the technical register before anything else. */
function InstrumentStrip() {
  const readings = [
    { label: "Runtime", value: "1.0.4" },
    { label: "Region", value: "eu-west-1" },
    { label: "P50 latency", value: "38 ms" },
  ];

  return (
    <div className="hidden border-b border-graphite-800/60 sm:block">
      <div className="mx-auto flex h-8 w-full max-w-7xl items-center justify-between gap-6 px-5 font-mono text-[0.62rem] tracking-[0.18em] text-slate-600 uppercase sm:px-8">
        <div className="flex items-center gap-6">
          {readings.map((reading) => (
            <span key={reading.label} className="flex items-center gap-2">
              <span className="text-slate-700">{reading.label}</span>
              <span className="text-slate-400">{reading.value}</span>
            </span>
          ))}
        </div>
        <span className="flex items-center gap-2 text-slate-400">
          <span className="status-lamp h-1.5 w-1.5 rounded-full bg-cyan-electric" />
          All systems nominal
        </span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-800/80 bg-graphite-950/80 backdrop-blur-md">
      <InstrumentStrip />
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.22em] text-slate-100 uppercase"
        >
          <CoreMark />
          Nexus
        </a>

        <nav aria-label="Sections" className="flex items-center gap-6">
          <a
            href="#capabilities"
            className="hidden font-mono text-xs tracking-[0.16em] text-slate-400 uppercase transition-colors hover:text-cyan-electric sm:inline"
          >
            Capabilities
          </a>
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
        className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-cyan-electric px-7 py-3.5 text-sm font-semibold text-graphite-950 transition-colors hover:bg-cyan-electric/85"
      >
        <span className="relative z-10">Launch the demo</span>
        <span
          aria-hidden="true"
          className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          →
        </span>
        {/* Light sweeps across the button on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-white/35 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[560%]"
        />
      </a>
      <a
        href="#workflow"
        className="inline-flex items-center justify-center rounded-full border border-graphite-600 px-7 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-electric/40 hover:text-slate-100"
      >
        See the workflow
      </a>
    </div>
  );
}

const SPECS = [
  { label: "Models", value: "Any provider" },
  { label: "Tools", value: "Scoped" },
  { label: "Checks", value: "Enforced" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-graphite-800/80"
    >
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(125%_52%_at_60%_94%,black,transparent_72%)] lg:[mask-image:radial-gradient(115%_85%_at_64%_42%,black,transparent_74%)]"
      />
      {/* Cyan pool behind the core, so the 3D sits in a body of light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[4%] h-[46%] w-[46%] -translate-y-1/2 rounded-full bg-cyan-deep/20 blur-[100px]"
      />
      <Crosshairs className="inset-4 hidden lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 xl:pl-24">
        {/* Vertical rail, only where the gutter can hold it without crowding. */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-5 hidden -translate-y-1/2 rotate-180 font-mono text-[0.6rem] tracking-[0.42em] text-slate-600 uppercase [writing-mode:vertical-rl] xl:block"
        >
          Nexus core / rev 1.0 / agentic runtime
        </span>

        <div className="relative grid grid-cols-1 items-center gap-10 py-14 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-12 lg:gap-0 lg:py-0">
          {/* Copy precedes the canvas in the DOM, so 390 px reads it first. */}
          <div className="relative z-10 flex flex-col items-start gap-7 lg:col-span-6 lg:py-24">
            <p
              className="rise flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.34em] text-cyan-electric uppercase"
              style={delay(0)}
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-cyan-electric/50"
              />
              Agentic runtime
            </p>

            <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.02em] text-ink [font-stretch:110%] sm:text-6xl">
              <span className="reveal-line">
                <span style={delay(90)}>One core.</span>
              </span>{" "}
              <span className="reveal-line">
                <span style={delay(200)}>Every AI workflow.</span>
              </span>
            </h1>

            <p
              className="rise max-w-[42ch] text-lg leading-relaxed text-slate-400 text-pretty"
              style={delay(340)}
            >
              Context, tools and checks around any model.
            </p>

            <div className="rise" style={delay(430)}>
              <CtaButtons />
            </div>

            <dl
              className="rise mt-1 grid w-full max-w-lg grid-cols-1 gap-x-6 gap-y-5 border-t border-graphite-800 pt-6 sm:grid-cols-3"
              style={delay(520)}
            >
              {SPECS.map((spec) => (
                <div key={spec.label}>
                  <dt className="font-mono text-[0.62rem] tracking-[0.22em] text-slate-600 uppercase">
                    {spec.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-slate-200">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            The core breaks out of the container on large screens: it starts
            behind the copy column, runs past the right edge and is trimmed by
            the section's overflow clip. On small screens it is simply the
            block that follows the copy.
          */}
          <div className="relative z-0 h-[320px] w-full overflow-hidden sm:h-[400px] lg:absolute lg:top-1/2 lg:left-[42%] lg:h-[min(76vh,640px)] lg:w-[64%] lg:-translate-y-1/2">
            <AiCoreCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- section headings -- */

function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  id: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-t border-graphite-800 pt-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-4">
        <p
          className="flex items-center gap-3 font-mono text-[0.66rem] tracking-[0.3em] text-slate-500 uppercase"
          data-reveal
        >
          <span className="text-cyan-electric">{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-graphite-600" />
          {eyebrow}
        </p>
        <h2
          id={id}
          data-reveal
          style={range(4, 58)}
          className="max-w-[26ch] text-[1.75rem] leading-tight font-semibold tracking-[-0.015em] text-slate-100 text-balance [font-stretch:106%] sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* --------------------------------------------------------- capabilities -- */

/** Deterministic hub-and-spoke geometry; computed once at module scope. */
const SCHEMATIC = (() => {
  const cx = 150;
  const cy = 74;
  const r = 52;

  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((-90 + i * 60) * Math.PI) / 180;
    return {
      key: i,
      x: Number((cx + r * Math.cos(angle)).toFixed(2)),
      y: Number((cy + r * Math.sin(angle)).toFixed(2)),
      accent: i % 3 === 1,
    };
  });
})();

function CoreSchematic() {
  const cx = 150;
  const cy = 74;

  return (
    <svg
      viewBox="0 0 300 152"
      className="h-auto w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* Orbits and spokes */}
      <circle cx={cx} cy={cy} r="52" stroke="#1d222b" strokeWidth="1" />
      <ellipse
        cx={cx}
        cy={cy}
        rx="76"
        ry="27"
        stroke="#3fe0ff"
        strokeOpacity="0.28"
        strokeWidth="1"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx="76"
        ry="27"
        stroke="#8b7cf6"
        strokeOpacity="0.28"
        strokeWidth="1"
        transform={`rotate(58 ${cx} ${cy})`}
      />
      {SCHEMATIC.map((node) => (
        <line
          key={node.key}
          x1={cx}
          y1={cy}
          x2={node.x}
          y2={node.y}
          stroke="#2b323d"
          strokeWidth="1"
        />
      ))}

      {/* Core */}
      <circle
        cx={cx}
        cy={cy}
        r="15"
        fill="#3fe0ff"
        fillOpacity="0.12"
        stroke="#3fe0ff"
        strokeWidth="1.2"
      />
      <circle cx={cx} cy={cy} r="5" fill="#3fe0ff" />

      {/* Satellites */}
      {SCHEMATIC.map((node) => (
        <circle
          key={node.key}
          cx={node.x}
          cy={node.y}
          r="3.4"
          fill={node.accent ? "#8b7cf6" : "#3fe0ff"}
        />
      ))}

      {/* Leader line + callout into the outermost ring node */}
      <path d="M195 48 L228 24 L238 24" stroke="#2b323d" strokeWidth="1" />
      <text
        x="244"
        y="27.5"
        fill="#8b7cf6"
        fontSize="9"
        letterSpacing="1.4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        SCOPED
      </text>

      {/* Ruler baseline */}
      <path d="M0 142 H300" stroke="#1d222b" strokeWidth="1" />
      {[0, 50, 100, 150, 200, 250, 300].map((x) => (
        <path
          key={x}
          d={`M${x === 0 ? 0.5 : x === 300 ? 299.5 : x} 137 v5`}
          stroke="#2b323d"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

const CAPABILITIES = [
  {
    index: "01",
    title: "Model-agnostic core",
    body: "Point NEXUS at any provider. Context, tools and checks stay put while the model underneath changes.",
    tags: ["hosted", "private", "local"],
    span: "lg:col-span-5",
    offset: "",
    schematic: true,
  },
  {
    index: "02",
    title: "Tools with permissions",
    body: "Every tool call carries a scope, a budget and a full trace, so agents act without holding production keys.",
    tags: ["scope", "budget", "trace"],
    span: "lg:col-span-4",
    offset: "lg:mt-12",
    schematic: false,
  },
  {
    index: "03",
    title: "Checks before ship",
    body: "Evals, guardrails and replay run on each change, so a regression never reaches a user unnoticed.",
    tags: ["evals", "guardrails", "replay"],
    span: "lg:col-span-3",
    offset: "lg:mt-24",
    schematic: false,
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="relative border-b border-graphite-800/80"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="01"
          eyebrow="What the runtime owns"
          id="capabilities-title"
          title="Three things the runtime holds, so your product doesn't have to."
        >
          <p
            className="max-w-[34ch] font-mono text-xs leading-relaxed tracking-[0.12em] text-slate-500 uppercase lg:max-w-[30ch] lg:text-right"
            data-reveal
            style={range(10, 64)}
          >
            One layer between your product and every model
          </p>
        </SectionHeading>

        {/* Deliberately uneven spans: 5 / 4 / 3, stepping down the page. */}
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:items-start">
          {CAPABILITIES.map((item, i) => (
            <li
              key={item.index}
              data-reveal
              style={range(i * 7, 56 + i * 7)}
              className={`group relative flex flex-col overflow-hidden rounded-lg border border-graphite-700 bg-graphite-900/70 p-6 transition-colors duration-300 hover:border-cyan-electric/30 hover:bg-graphite-850 md:col-span-1 lg:p-7 ${item.span} ${item.offset} ${
                item.schematic ? "md:col-span-2" : ""
              }`}
            >
              {/* Cyan hairline lights up along the top edge on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-cyan-electric via-cyan-electric/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.66rem] tracking-[0.24em] text-cyan-electric">
                  {item.index}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-graphite-700 transition-colors duration-300 group-hover:bg-cyan-electric/25"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-slate-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>

              {/* Concrete spec chips: real surface area, not adjectives. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded border border-graphite-700 px-2 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-slate-500 uppercase transition-colors duration-300 group-hover:border-graphite-600 group-hover:text-slate-400"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {item.schematic ? (
                <div className="mt-7 border-t border-graphite-800 pt-6">
                  <CoreSchematic />
                </div>
              ) : null}
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
      className="relative border-b border-graphite-800/80"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="02"
          eyebrow="From keys to production"
          id="workflow-title"
          title="Four steps, one continuous line."
        >
          <p
            className="max-w-[34ch] font-mono text-xs leading-relaxed tracking-[0.12em] text-slate-500 uppercase lg:max-w-[26ch] lg:text-right"
            data-reveal
            style={range(10, 64)}
          >
            Runs are replayable at every step
          </p>
        </SectionHeading>

        {/* The rail runs behind the nodes: vertical on mobile, horizontal on lg. */}
        <ol className="relative mt-12 grid grid-cols-1 gap-9 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[19px] w-px bg-linear-to-b from-cyan-electric/45 via-graphite-700 to-transparent lg:top-[19px] lg:right-[14%] lg:bottom-auto lg:left-5 lg:h-px lg:w-auto lg:bg-linear-to-r"
          />

          {WORKFLOW.map((item, i) => (
            <li
              key={item.step}
              data-reveal
              style={range(i * 8, 52 + i * 8)}
              className="group relative pl-14 lg:pl-0"
            >
              <span className="absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-md border border-graphite-600 bg-graphite-900 font-mono text-xs text-cyan-electric transition-colors duration-300 group-hover:border-cyan-electric/50 lg:static lg:mb-6">
                {item.step}
              </span>
              <h3 className="text-base font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-slate-400">
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
    <section
      id="demo"
      aria-labelledby="demo-title"
      className="relative"
      data-reveal
      style={range(0, 50)}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-2xl border border-graphite-700 bg-graphite-900 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-cyan-deep/25 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-violet-deep/25 blur-[90px]"
          />
          {/* Concentric rings, drifting off the right edge of the panel. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            className="pointer-events-none absolute top-1/2 -right-24 h-[150%] w-auto -translate-y-1/2 opacity-[0.22] lg:-right-10"
            fill="none"
          >
            {[70, 110, 150, 190].map((r) => (
              <circle
                key={r}
                cx="200"
                cy="200"
                r={r}
                stroke={r % 3 === 0 ? "#8b7cf6" : "#3fe0ff"}
                strokeWidth="1"
              />
            ))}
            <circle cx="200" cy="200" r="30" fill="#3fe0ff" fillOpacity="0.25" />
          </svg>
          <Crosshairs className="inset-5" />

          <div className="relative flex flex-col items-start gap-6">
            <p className="font-mono text-[0.7rem] tracking-[0.32em] text-cyan-electric uppercase">
              Product demo
            </p>
            <h2
              id="demo-title"
              className="max-w-[20ch] text-[1.9rem] leading-tight font-semibold tracking-[-0.015em] text-ink text-balance [font-stretch:108%] sm:text-4xl"
            >
              See the core run a workflow end to end.
            </h2>
            <p className="max-w-[52ch] text-base leading-relaxed text-slate-400">
              Open the sample workspace: connect a model, attach two tools and
              watch the checks run before anything ships.
            </p>
            <CtaButtons />

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-graphite-800 pt-5 font-mono text-[0.66rem] tracking-[0.2em] text-slate-600 uppercase">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="status-lamp h-1.5 w-1.5 rounded-full bg-cyan-electric" />
                Sample workspace ready
              </span>
              <span aria-hidden="true" className="hidden text-graphite-600 sm:inline">
                /
              </span>
              <span>No signup required</span>
            </p>
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
      {/* Tick marks read as the bottom edge of a technical drawing. */}
      <div
        aria-hidden="true"
        className="mx-auto flex h-3 w-full max-w-7xl items-start justify-between px-5 sm:px-8"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="h-2 w-px bg-graphite-700" />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 pt-5 pb-9 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-500 uppercase">
          NEXUS — agentic runtime for product teams
        </p>
        <div className="flex items-center gap-5">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-600 uppercase">
            Fictional product · demo page
          </p>
          <a
            href="#top"
            className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-500 uppercase transition-colors hover:text-cyan-electric"
          >
            Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
