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
      className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-graphite-900 shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset]"
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
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
    { label: "Релиз", value: "1.0.4" },
    { label: "Регион", value: "eu-west-1" },
    { label: "Отклик p50", value: "38 мс" },
  ];

  return (
    <div className="hidden border-b border-white/5 sm:block">
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
          Все системы в норме
        </span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-graphite-950/70 backdrop-blur-xl">
      <InstrumentStrip />
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-slate-100 uppercase"
        >
          <CoreMark />
          Nexus
        </a>

        <nav aria-label="Разделы" className="flex items-center gap-2 sm:gap-6">
          <a
            href="#capabilities"
            className="hidden font-mono text-xs tracking-[0.16em] text-slate-400 uppercase transition-colors hover:text-cyan-electric sm:inline"
          >
            Возможности
          </a>
          <a
            href="#workflow"
            className="hidden font-mono text-xs tracking-[0.16em] text-slate-400 uppercase transition-colors hover:text-cyan-electric sm:inline"
          >
            Процесс
          </a>
          <a
            href="#demo"
            className="rounded-full border border-cyan-electric/30 bg-cyan-electric/5 px-4 py-2 font-mono text-[0.68rem] tracking-[0.16em] text-cyan-electric uppercase transition-colors hover:border-cyan-electric/70 hover:bg-cyan-electric/10"
          >
            Открыть демо
          </a>
        </nav>
      </div>
      {/* Reading progress: scaleX is driven by the scroll timeline in CSS. */}
      <span
        aria-hidden="true"
        className="scroll-progress hairline absolute inset-x-0 -bottom-px h-px"
      />
    </header>
  );
}

/* ----------------------------------------------------------------- hero -- */

function CtaButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <a href="#demo" className="btn-primary group">
        <span className="relative z-10">Открыть демо</span>
        <span
          aria-hidden="true"
          className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          →
        </span>
        <span aria-hidden="true" className="btn-sheen" />
      </a>
      <a href="#workflow" className="btn-ghost">
        Как это работает
      </a>
    </div>
  );
}

const SPECS = [
  { label: "Модели", value: "Любой провайдер" },
  { label: "Инструменты", value: "С правами" },
  { label: "Проверки", value: "До релиза" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/5">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(125%_52%_at_60%_94%,black,transparent_72%)] lg:[mask-image:radial-gradient(115%_85%_at_64%_42%,black,transparent_74%)]"
      />
      {/* Cyan pool behind the core, so the 3D sits in a body of light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[4%] h-[48%] w-[48%] -translate-y-1/2 rounded-full bg-cyan-deep/20 blur-[110px]"
      />
      <Crosshairs className="inset-4 hidden lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 xl:pl-24">
        {/* Vertical rail, only where the gutter can hold it without crowding. */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-5 hidden -translate-y-1/2 rotate-180 font-mono text-[0.6rem] tracking-[0.42em] text-slate-600 uppercase [writing-mode:vertical-rl] xl:block"
        >
          NEXUS core / rev 1.0 / агентный рантайм
        </span>

        <div className="relative grid grid-cols-1 items-center gap-10 py-14 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-12 lg:gap-0 lg:py-0">
          {/* Copy precedes the canvas in the DOM, so 390 px reads it first. */}
          <div className="relative z-10 flex flex-col items-start gap-7 lg:col-span-6 lg:py-24">
            <p
              className="rise flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.34em] text-cyan-electric uppercase"
              style={delay(0)}
            >
              <span aria-hidden="true" className="h-px w-8 bg-cyan-electric/50" />
              Агентный рантайм
            </p>

            <h1 className="text-[2.5rem] leading-[1.03] font-extrabold tracking-[-0.03em] text-ink sm:text-[3.9rem]">
              <span className="reveal-line">
                <span style={delay(90)}>Одно ядро.</span>
              </span>{" "}
              <span className="reveal-line">
                <span
                  className="bg-linear-to-r from-ink via-ink to-cyan-electric/80 bg-clip-text text-transparent"
                  style={delay(200)}
                >
                  Любой AI-процесс.
                </span>
              </span>
            </h1>

            <p
              className="rise max-w-[44ch] text-lg leading-relaxed text-slate-400 text-pretty"
              style={delay(340)}
            >
              Модель — расходник. Мета — своя обвязка: контекст, инструменты и
              проверки вокруг любой модели. Рантайм держит её на себе, а вы
              занимаетесь агентами, а не инфраструктурой.
            </p>

            <div className="rise" style={delay(430)}>
              <CtaButtons />
            </div>

            <dl
              className="rise mt-1 grid w-full max-w-lg grid-cols-1 gap-x-6 gap-y-5 border-t border-white/5 pt-6 sm:grid-cols-3"
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
          <div className="relative z-0 h-[360px] w-full overflow-hidden sm:h-[430px] lg:absolute lg:top-1/2 lg:left-[40%] lg:h-[min(78vh,660px)] lg:w-[66%] lg:-translate-y-1/2">
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
    <div className="flex flex-col gap-6 border-t border-white/5 pt-6 lg:flex-row lg:items-end lg:justify-between">
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
          className="max-w-[28ch] text-[1.7rem] leading-[1.12] font-bold tracking-[-0.025em] text-slate-100 text-balance sm:text-[2.4rem]"
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
        SCOPE
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
    title: "Ядро без привязки к модели",
    body: "Модель меняется одной строкой — контекст, инструменты и проверки остаются на месте. Ценность копится в вашей обвязке, а не в чужом API.",
    tags: ["облако", "приватно", "локально"],
    span: "lg:col-span-5",
    offset: "",
    schematic: true,
  },
  {
    index: "02",
    title: "Инструменты с правами",
    body: "Тот же принцип, что в n8n и Zapier, только каждый вызов несёт scope, бюджет и трейс. Агент работает с вашими системами и не держит продовых ключей.",
    tags: ["права", "бюджет", "трейс"],
    span: "lg:col-span-4",
    offset: "lg:mt-12",
    schematic: false,
  },
  {
    index: "03",
    title: "Проверки до релиза",
    body: "Evals, guardrails и replay прогоняются на каждом изменении — регресс не доходит до пользователя.",
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
      className="relative border-b border-white/5"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="01"
          eyebrow="Что рантайм берёт на себя"
          id="capabilities-title"
          title="Три вещи, которые рантайм держит на себе, — чтобы вы занимались агентами, а не инфраструктурой."
        >
          <p
            className="max-w-[34ch] font-mono text-xs leading-relaxed tracking-[0.12em] text-slate-500 uppercase lg:max-w-[30ch] lg:text-right"
            data-reveal
            style={range(10, 64)}
          >
            Один слой между продуктом и любой моделью
          </p>
        </SectionHeading>

        {/* Deliberately uneven spans: 5 / 4 / 3, stepping down the page. */}
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:items-start">
          {CAPABILITIES.map((item, i) => (
            <li
              key={item.index}
              data-reveal
              style={range(i * 7, 56 + i * 7)}
              className={`group panel flex flex-col overflow-hidden p-6 transition-colors duration-500 hover:border-cyan-electric/25 md:col-span-1 lg:p-7 ${item.span} ${item.offset} ${
                item.schematic ? "md:col-span-2" : ""
              }`}
            >
              {/* Cyan hairline lights up along the top edge on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-cyan-electric via-cyan-electric/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              {/* Soft cyan pool that only appears on hover. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-cyan-deep/0 blur-3xl transition-colors duration-700 group-hover:bg-cyan-deep/25"
              />

              <div className="relative flex items-center gap-3">
                <span className="font-mono text-[0.66rem] tracking-[0.24em] text-cyan-electric">
                  {item.index}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-graphite-700 transition-colors duration-300 group-hover:bg-cyan-electric/25"
                />
              </div>

              <h3 className="relative mt-5 text-lg font-bold tracking-[-0.015em] text-slate-100">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>

              {/* Concrete spec chips: real surface area, not adjectives. */}
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>

              {item.schematic ? (
                <div className="relative mt-7 border-t border-white/5 pt-6">
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
    title: "Подключить",
    body: "Ключи моделей, базы данных, n8n и Zapier — в одном рантайме.",
  },
  {
    step: "02",
    title: "Собрать",
    body: "Контекст, инструменты и проверки складываются в один процесс.",
  },
  {
    step: "03",
    title: "Наблюдать",
    body: "Replay каждого прогона: трейсы, стоимость и история вызовов.",
  },
  {
    step: "04",
    title: "Выпустить",
    body: "Промоут процесса за один стабильный эндпоинт.",
  },
];

/** The argument for the section: why the work moved into the wiring. */
const WHY = [
  {
    index: "A",
    title: "Модели сравниваются",
    body: "Разрыв между топовыми моделями стирается за месяцы. Дифференциация уходит из модели в обвязку.",
  },
  {
    index: "B",
    title: "Обвязка накапливается",
    body: "Контекст, инструменты и проверки — актив, который остаётся, когда модель под вами меняется.",
  },
  {
    index: "C",
    title: "n8n и Zapier доказали спрос",
    body: "Автоматизация без кода стала нормой. Следующий шаг — автономные агенты на тех же рельсах.",
  },
];

const INTEGRATIONS = [
  "n8n",
  "Zapier",
  "Make",
  "Slack",
  "Notion",
  "Postgres",
  "GitHub",
  "HTTP",
  "Telegram",
];

export function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="relative border-b border-white/5"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="02"
          eyebrow="От ключей до продакшена"
          id="workflow-title"
          title="Четыре шага одной непрерывной линией."
        >
          <p
            className="max-w-[34ch] font-mono text-xs leading-relaxed tracking-[0.12em] text-slate-500 uppercase lg:max-w-[26ch] lg:text-right"
            data-reveal
            style={range(10, 64)}
          >
            Каждый прогон воспроизводим
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
              <span className="absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-graphite-900 font-mono text-xs text-cyan-electric shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset] transition-colors duration-300 group-hover:border-cyan-electric/45 lg:static lg:mb-6">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Why this work is the meta — three short claims, no new section. */}
        <div className="mt-16 border-t border-white/5 pt-8 lg:mt-20">
          <p
            className="font-mono text-[0.66rem] tracking-[0.3em] text-slate-500 uppercase"
            data-reveal
          >
            Почему это мета
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {WHY.map((item, i) => (
              <li
                key={item.index}
                data-reveal
                style={range(i * 8, 50 + i * 8)}
                className="relative border-t border-white/5 pt-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-10 bg-linear-to-r from-cyan-electric to-transparent"
                />
                <span className="font-mono text-[0.66rem] tracking-[0.24em] text-violet-soft">
                  {item.index}
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-slate-400">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Endless integration rail: two identical tracks, one shared slide. */}
        <div
          className="ticker-mask mt-14 overflow-hidden border-y border-white/5 py-5"
          data-reveal
        >
          <div className="ticker flex w-max items-center gap-10">
            {[0, 1].map((track) => (
              <ul
                key={track}
                aria-hidden={track === 1}
                className="flex items-center gap-10 font-mono text-[0.68rem] tracking-[0.28em] text-slate-500 uppercase"
              >
                {INTEGRATIONS.map((name) => (
                  <li key={name} className="flex items-center gap-10">
                    {name}
                    <span className="h-1 w-1 rounded-full bg-graphite-600" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
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
        <div className="panel relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
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
              Демо продукта
            </p>
            <h2
              id="demo-title"
              className="max-w-[24ch] text-[1.85rem] leading-[1.12] font-bold tracking-[-0.025em] text-ink sm:text-[2.6rem]"
            >
              Посмотрите, как ядро проводит процесс от начала до конца.
            </h2>
            <p className="max-w-[54ch] text-base leading-relaxed text-slate-400">
              Откройте демо-воркспейс: подключите модель, добавьте два
              инструмента и посмотрите, как проверки отрабатывают до релиза.
              Так выглядит автоматизация, которую не страшно оставить без
              присмотра.
            </p>
            <CtaButtons />

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/5 pt-5 font-mono text-[0.66rem] tracking-[0.2em] text-slate-600 uppercase">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="status-lamp h-1.5 w-1.5 rounded-full bg-cyan-electric" />
                Демо-воркспейс готов
              </span>
              <span aria-hidden="true" className="hidden text-graphite-600 sm:inline">
                /
              </span>
              <span>Без регистрации</span>
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
    <footer className="border-t border-white/5">
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
          NEXUS — агентный рантайм для продуктовых команд
        </p>
        <div className="flex items-center gap-5">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-600 uppercase">
            Вымышленный продукт · демо-страница
          </p>
          <a
            href="#top"
            className="font-mono text-[0.7rem] tracking-[0.18em] text-slate-500 uppercase transition-colors hover:text-cyan-electric"
          >
            Наверх ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
