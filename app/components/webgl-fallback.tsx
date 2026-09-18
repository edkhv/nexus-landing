"use client";

import { Component, type ReactNode } from "react";

/**
 * Calm DOM stand-in for the hero visual. It is shown when WebGL is
 * unavailable, when the model fails to load, or as the pre-hydration shell.
 * No animation: it reads as a static technical diagram.
 */
export function AiCoreFallback({
  note = "Static preview — the live 3D core needs WebGL.",
}: {
  note?: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="relative grid h-40 w-40 place-items-center sm:h-52 sm:w-52">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-cyan-electric/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-5 rounded-full border border-violet-soft/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-10 rounded-full border border-graphite-600"
        />
        <div
          aria-hidden="true"
          className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-electric/70 to-violet-soft/50"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 h-1.5 w-1.5 rounded-full bg-cyan-electric"
        />
      </div>
      <p className="max-w-[22rem] font-mono text-[0.7rem] leading-relaxed tracking-[0.18em] text-slate-500 uppercase">
        {note}
      </p>
    </div>
  );
}

type BoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type BoundaryState = { failed: boolean };

/**
 * Catches GLB / renderer failures so the page never breaks around the canvas.
 * The parent decides what to show, via `onError`.
 */
export class CanvasErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return null;
    }

    return this.props.children;
  }
}