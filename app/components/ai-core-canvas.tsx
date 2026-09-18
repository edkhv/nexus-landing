"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AiCoreFallback, CanvasErrorBoundary } from "./webgl-fallback";

const MODEL_URL = "/models/ai-core.glb";

/** Keeps the core inside the 4.5-unit camera frame on narrow columns. */
const MODEL_SCALE = 0.94;

/* ---------------------------------------------------------------- hooks -- */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);

  return () => query.removeEventListener("change", onStoreChange);
}

const getReducedMotion = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Motion is allowed on the server render; the client corrects it on hydration. */
const getReducedMotionOnServer = () => false;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
}

type WebGLSupport = "unknown" | "ok" | "unavailable";

let webglProbe: WebGLSupport | null = null;

function probeWebGL(): WebGLSupport {
  if (webglProbe) {
    return webglProbe;
  }

  try {
    const canvas = document.createElement("canvas");
    webglProbe = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
      ? "ok"
      : "unavailable";
  } catch {
    webglProbe = "unavailable";
  }

  return webglProbe;
}

const subscribeToNothing = () => () => {};

/** "unknown" on the server, so the first paint is the calm placeholder. */
function useWebGLSupport(): WebGLSupport {
  return useSyncExternalStore(
    subscribeToNothing,
    probeWebGL,
    () => "unknown" as const,
  );
}

/* ----------------------------------------------------------------- scene -- */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#9fd8ff", "#0a0c11", 0.55]} />
      <directionalLight
        position={[3.5, 4.5, 5]}
        intensity={1.7}
        color="#d8f3ff"
      />
      <directionalLight
        position={[-4, -2.5, -3]}
        intensity={0.7}
        color="#8b7cf6"
      />
      <pointLight position={[0, 0, 3]} intensity={0.45} color="#3fe0ff" />
    </>
  );
}

function AiCore({
  reducedMotion,
  onReady,
}: {
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    onReady();
  }, [invalidate, onReady, scene]);

  // In demand mode (reduced motion) pointer moves must ask for frames.
  useEffect(() => {
    if (!reducedMotion) {
      return;
    }

    const element = gl.domElement;
    const requestFrame = () => invalidate();

    element.addEventListener("pointermove", requestFrame);

    return () => element.removeEventListener("pointermove", requestFrame);
  }, [gl, invalidate, reducedMotion]);

  useFrame((state, delta) => {
    const tiltGroup = tilt.current;
    const spinGroup = spin.current;

    if (!tiltGroup || !spinGroup) {
      return;
    }

    const step = Math.min(delta, 0.05);

    // Slow, technical idle rotation — off when motion is reduced.
    if (!reducedMotion) {
      spinGroup.rotation.y += step * 0.15;
    }

    // Very small pointer reaction (~3-5 degrees at most).
    const targetX = -state.pointer.y * 0.06;
    const targetY = state.pointer.x * 0.09;

    tiltGroup.rotation.x = THREE.MathUtils.damp(
      tiltGroup.rotation.x,
      targetX,
      3,
      step,
    );
    tiltGroup.rotation.y = THREE.MathUtils.damp(
      tiltGroup.rotation.y,
      targetY,
      3,
      step,
    );

    if (reducedMotion) {
      const settled =
        Math.abs(tiltGroup.rotation.x - targetX) < 0.0005 &&
        Math.abs(tiltGroup.rotation.y - targetY) < 0.0005;

      // Keep the on-demand loop alive until the tilt comes to rest.
      if (!settled) {
        invalidate();
      }
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin} rotation={[0.12, -0.4, 0]}>
        <group scale={MODEL_SCALE}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------- canvas -- */

function AiCoreStage({
  reducedMotion,
  onReady,
  onContextLost,
}: {
  reducedMotion: boolean;
  onReady: () => void;
  onContextLost: () => void;
}) {
  const handleCreated = useCallback(
    ({ gl }: RootState) => {
      gl.domElement.addEventListener(
        "webglcontextlost",
        (event) => {
          event.preventDefault();
          onContextLost();
        },
        { once: true },
      );
    },
    [onContextLost],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 35, near: 0.1, far: 50 }}
      dpr={[1, 2]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={handleCreated}
    >
      <Suspense fallback={null}>
        <AiCore reducedMotion={reducedMotion} onReady={onReady} />
      </Suspense>
      <Lights />
    </Canvas>
  );
}

/* -------------------------------------------------------------- wrapper -- */

export default function AiCoreCanvas() {
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const webgl = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();

  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleContextLost = useCallback(() => setContextLost(true), []);
  const handleSceneError = useCallback(() => setSceneFailed(true), []);

  // Teardown after a load failure also reports a lost context, so the
  // failure reason wins the priority order.
  const fallbackNote = sceneFailed
    ? "Static preview — the model could not be loaded."
    : contextLost
      ? "Static preview — the 3D context was lost."
      : "Static preview — this device has no WebGL.";

  const showFallback =
    webgl === "unavailable" || sceneFailed || contextLost;
  const canRender3d = webgl === "ok" && !showFallback;

  return (
    <figure className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Depth without postprocessing: two soft CSS light pools. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-deep/25 blur-[70px]" />
        <div className="absolute top-[62%] left-[62%] h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-deep/25 blur-[70px]" />
      </div>

      {showFallback ? (
        <div className="relative z-10">
          <AiCoreFallback note={fallbackNote} />
        </div>
      ) : (
        <>
          {/* Loading plate sits above the canvas so the reveal stays clean. */}
          <div
            aria-hidden={sceneReady}
            className={`absolute inset-0 z-20 transition-opacity duration-700 ${
              sceneReady
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }`}
          >
            <AiCoreFallback note="Initializing core…" />
          </div>

          <CanvasErrorBoundary onError={handleSceneError}>
            <div className="relative z-10 h-full w-full">
              {canRender3d ? (
                <AiCoreStage
                  reducedMotion={reducedMotion}
                  onReady={handleReady}
                  onContextLost={handleContextLost}
                />
              ) : null}
            </div>
          </CanvasErrorBoundary>
        </>
      )}

      <figcaption className="sr-only">
        NEXUS AI Core: a graphite core wrapped by cyan and violet rings. The
        model rotates slowly and follows the pointer slightly.
      </figcaption>
    </figure>
  );
}