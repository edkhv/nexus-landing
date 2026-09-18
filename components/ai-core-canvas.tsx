"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type RootState,
  type ThreeEvent,
} from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AiCoreFallback, CanvasErrorBoundary } from "./webgl-fallback";

const MODEL_URL = "/models/ai-core.glb";

/** Keeps the core inside the 4.5-unit camera frame on narrow columns. */
const MODEL_SCALE = 0.9;

/** Three rings are enough for overlapping taps without an object pool. */
const PULSE_COUNT = 3;

/*
 * Metallic graphite has almost no diffuse response, so its brightness is
 * really the environment reflection. The core is driven harder than the rings
 * to keep the sphere from reading as a black hole in the middle of the frame.
 */
const RING_ENV = 1.35;
const CORE_ENV = 1.8;

/* ---------------------------------------------------------------- hooks -- */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);

  return () => query.removeEventListener("change", onStoreChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

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
    webglProbe =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
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
  return useSyncExternalStore(subscribeToNothing, probeWebGL, () => "unknown");
}

/* ----------------------------------------------------------------- light -- */

/**
 * The environment is built from light cards rather than an HDR file: the
 * metallic graphite reads as a polished surface only when something is
 * reflected in it, and this keeps the page free of remote assets.
 */
function CoreEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#05070c"]} />
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#cdefff"
        scale={[7, 5, 1]}
        position={[5, 6, 6]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.6}
        color="#8b7cf6"
        scale={[6, 5, 1]}
        position={[-6, -3, -4]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="ring"
        intensity={1.5}
        color="#3fe0ff"
        scale={3.4}
        position={[0, 1.5, -7]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={0.9}
        color="#ffffff"
        scale={[12, 1.6, 1]}
        position={[0, -6, 3]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#9fd8ff", "#0a0c11", 0.45]} />
      <directionalLight
        position={[3.5, 4.5, 5]}
        intensity={1.5}
        color="#d8f3ff"
      />
      <directionalLight
        position={[-4, -2.5, -3]}
        intensity={0.65}
        color="#8b7cf6"
      />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#3fe0ff" />
    </>
  );
}

/* ------------------------------------------------------------------ dust -- */

/** Deterministic PRNG: the same field on every render, no hydration drift. */
function makeRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

function Dust({ reducedMotion }: { reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 460;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color("#8feaff");
    const violet = new THREE.Color("#b6a8ff");
    const random = makeRandom(20240919);

    for (let i = 0; i < count; i += 1) {
      const radius = 1.18 + Math.pow(random(), 0.75) * 0.95;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const tint = random() > 0.58 ? violet : cyan;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.58;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return buffer;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (reducedMotion || !points.current) {
      return;
    }

    points.current.rotation.y -= Math.min(delta, 0.05) * 0.045;
    points.current.rotation.x =
      Math.sin(performance.now() * 0.00005) * 0.05 - 0.06;
  });

  return (
    <points ref={points} geometry={geometry} raycast={() => null}>
      <pointsMaterial
        size={0.024}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ core -- */

type DragState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  spinVelocity: number;
  pitch: number;
  travelled: number;
};

type PulseState = {
  timers: number[];
  cursor: number;
  flash: number;
  boost: number;
};

function AiCore({
  reducedMotion,
  onReady,
  onInteract,
}: {
  reducedMotion: boolean;
  onReady: () => void;
  onInteract: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);

  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const drift = useRef<THREE.Group>(null);
  const pulseRings = useRef<Array<THREE.Mesh | null>>([]);

  const coreMaterial = useRef<THREE.MeshStandardMaterial | null>(null);
  const ringMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const ringEmissive = useRef<number[]>([]);
  const hovered = useRef(false);

  const drag = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    spinVelocity: 0,
    pitch: 0,
    travelled: 0,
  });

  const pulse = useRef<PulseState>({
    timers: Array.from({ length: PULSE_COUNT }, () => 1),
    cursor: 0,
    flash: 0,
    boost: 0,
  });

  const scrollProgress = useRef(0);

  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const interacted = useRef(false);

  /* Materials are cloned so the interaction states never leak into the cache. */
  useEffect(() => {
    const rings: THREE.MeshStandardMaterial[] = [];
    const emissive: number[] = [];
    let core: THREE.MeshStandardMaterial | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;

      if (!mesh.isMesh) {
        return;
      }

      const material = (Array.isArray(mesh.material)
        ? mesh.material[0]
        : mesh.material) as THREE.MeshStandardMaterial;

      if (!material || !("envMapIntensity" in material)) {
        return;
      }

      const clone = material.clone();
      clone.envMapIntensity = clone.name.includes("Core") ? CORE_ENV : RING_ENV;
      mesh.material = clone;

      if (clone.name.includes("Core")) {
        core = clone;
      } else {
        rings.push(clone);
        emissive.push(clone.emissiveIntensity ?? 1);
      }
    });

    coreMaterial.current = core;
    ringMaterials.current = rings;
    ringEmissive.current = emissive;

    invalidate();
    onReady();
  }, [invalidate, onReady, scene]);

  const triggerPulse = useCallback(() => {
    const state = pulse.current;
    state.timers[state.cursor % PULSE_COUNT] = 0;
    state.cursor += 1;
    state.flash = 1;
    state.boost = 1;
  }, []);

  /* Pointer drag: horizontal spins the core, vertical tilts and springs back. */
  useEffect(() => {
    const element = gl.domElement;
    const state = drag.current;
    const markInteracted = () => {
      if (interacted.current) {
        return;
      }

      interacted.current = true;
      onInteract();
    };

    const handleDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.travelled = 0;
    };

    const handleMove = (event: PointerEvent) => {
      if (!state.dragging) {
        return;
      }

      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;

      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.travelled += Math.abs(dx) + Math.abs(dy);
      state.spinVelocity = THREE.MathUtils.clamp(
        -dx * 0.12,
        -6,
        6,
      );
      state.pitch = THREE.MathUtils.clamp(state.pitch + dy * 0.0035, -0.5, 0.5);

      if (state.travelled > 10) {
        markInteracted();
      }

      if (reducedMotion) {
        invalidate();
      }
    };

    const handleUp = () => {
      if (!state.dragging) {
        return;
      }

      state.dragging = false;

      if (state.travelled < 10) {
        markInteracted();
        triggerPulse();
      }

      if (reducedMotion) {
        invalidate();
      }
    };

    const handleCancel = () => {
      state.dragging = false;
    };

    element.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      element.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [gl, invalidate, onInteract, reducedMotion, triggerPulse]);

  /* Scroll is the second, mouse-free driver: the core keeps turning as you read. */
  useEffect(() => {
    const update = () => {
      const span = Math.max(window.innerHeight, 1);
      scrollProgress.current = THREE.MathUtils.clamp(
        window.scrollY / span,
        0,
        1,
      );

      if (reducedMotion) {
        invalidate();
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [invalidate, reducedMotion]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const dragState = drag.current;
    const pulseState = pulse.current;

    if (!dragState.dragging) {
      dragState.spinVelocity = THREE.MathUtils.damp(
        dragState.spinVelocity,
        0,
        1.5,
        step,
      );
      dragState.pitch = THREE.MathUtils.damp(dragState.pitch, 0, 2.4, step);
    }

    // Idle rotation, plus the momentum of a flicked drag.
    if (spin.current) {
      const idle = reducedMotion ? 0 : 0.13 + pulseState.boost * 0.55;
      spin.current.rotation.y += (idle + dragState.spinVelocity) * step;
    }

    pulseState.boost = THREE.MathUtils.damp(pulseState.boost, 0, 1.3, step);
    pulseState.flash = THREE.MathUtils.damp(pulseState.flash, 0, 3, step);

    // Pointer parallax that adds to whatever the drag left behind.
    if (tilt.current) {
      const targetX = -state.pointer.y * 0.12 - dragState.pitch;
      const targetY = state.pointer.x * 0.18;

      tilt.current.rotation.x = THREE.MathUtils.damp(
        tilt.current.rotation.x,
        targetX,
        4,
        step,
      );
      tilt.current.rotation.y = THREE.MathUtils.damp(
        tilt.current.rotation.y,
        targetY,
        4,
        step,
      );
    }

    // Reading progress swings the whole assembly — no pointer required.
    if (drift.current) {
      const progress = scrollProgress.current;

      drift.current.rotation.z = THREE.MathUtils.damp(
        drift.current.rotation.z,
        progress * 0.42,
        3,
        step,
      );
      drift.current.rotation.x = THREE.MathUtils.damp(
        drift.current.rotation.x,
        progress * 0.2,
        3,
        step,
      );
      drift.current.position.y = THREE.MathUtils.damp(
        drift.current.position.y,
        progress * 0.24,
        3,
        step,
      );
    }

    let animating = false;

    for (let i = 0; i < pulseState.timers.length; i += 1) {
      const ring = pulseRings.current[i];

      if (!ring) {
        continue;
      }

      if (pulseState.timers[i] >= 1) {
        if (ring.visible) {
          ring.visible = false;
        }

        continue;
      }

      pulseState.timers[i] = Math.min(1, pulseState.timers[i] + step / 1.15);
      animating = true;
      ring.visible = true;
      ring.quaternion.copy(camera.quaternion);
      ring.scale.setScalar(0.78 + pulseState.timers[i] * 1.15);

      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = 0.45 * Math.pow(1 - pulseState.timers[i], 2.4);
    }

    // Emissive rings answer to hover, to the pulse flash and to the spin.
    const glow = 1 + pulseState.flash * 1.2 + (hovered.current ? 0.4 : 0);

    ringMaterials.current.forEach((material, i) => {
      material.emissiveIntensity = (ringEmissive.current[i] ?? 1) * glow;
    });

    if (coreMaterial.current) {
      coreMaterial.current.envMapIntensity = CORE_ENV + pulseState.flash * 1.1;
    }

    if (reducedMotion) {
      const tiltBusy =
        tilt.current !== null &&
        (Math.abs(tilt.current.rotation.x) > 0.0004 ||
          Math.abs(tilt.current.rotation.y) > 0.0004);
      const spinBusy = Math.abs(dragState.spinVelocity) > 0.0004;

      if (animating || tiltBusy || spinBusy) {
        invalidate();
      }
    }
  });

  const handleEnter = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      hovered.current = true;

      if (reducedMotion) {
        invalidate();
      }
    },
    [invalidate, reducedMotion],
  );

  const handleLeave = useCallback(() => {
    hovered.current = false;

    if (reducedMotion) {
      invalidate();
    }
  }, [invalidate, reducedMotion]);

  return (
    <>
      <group
        onPointerOver={handleEnter}
        onPointerOut={handleLeave}
        onPointerDown={handleEnter}
      >
        <group ref={drift}>
          <group ref={tilt}>
            <group ref={spin} rotation={[0.16, -0.55, 0.06]}>
              <group scale={MODEL_SCALE}>
                <primitive object={scene} />
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Billboards live outside the rotating groups so they always face camera. */}
      {Array.from({ length: PULSE_COUNT }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            pulseRings.current[index] = node;
          }}
          visible={false}
          raycast={() => null}
        >
          <ringGeometry args={[0.98, 1.02, 128]} />
          <meshBasicMaterial
            color={index === 1 ? "#b6a8ff" : "#3fe0ff"}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- canvas -- */

function AiCoreStage({
  reducedMotion,
  onReady,
  onInteract,
  onContextLost,
}: {
  reducedMotion: boolean;
  onReady: () => void;
  onInteract: () => void;
  onContextLost: () => void;
}) {
  const handleCreated = useCallback(
    ({ gl }: RootState) => {
      gl.toneMappingExposure = 1.06;
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
      dpr={[1.5, 2]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={handleCreated}
    >
      <Suspense fallback={null}>
        <AiCore
          reducedMotion={reducedMotion}
          onReady={onReady}
          onInteract={onInteract}
        />
        <Dust reducedMotion={reducedMotion} />
      </Suspense>
      <CoreEnvironment />
      <Lights />
    </Canvas>
  );
}

/* -------------------------------------------------------------- wrapper -- */

export default function AiCoreCanvas() {
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const webgl = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();

  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleInteract = useCallback(() => setHintDismissed(true), []);
  const handleContextLost = useCallback(() => setContextLost(true), []);
  const handleSceneError = useCallback(() => setSceneFailed(true), []);

  // Teardown after a load failure also reports a lost context, so the
  // failure reason wins the priority order.
  const fallbackNote = sceneFailed
    ? "Статичный вид — модель не загрузилась."
    : contextLost
      ? "Статичный вид — 3D-контекст потерян."
      : "Статичный вид — на этом устройстве нет WebGL.";

  const showFallback = webgl === "unavailable" || sceneFailed || contextLost;
  const canRender3d = webgl === "ok" && !showFallback;

  return (
    <figure className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Depth without postprocessing: two soft CSS light pools. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-deep/25 blur-[80px]" />
        <div className="absolute top-[60%] left-[60%] h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-deep/25 blur-[80px]" />
        <div className="core-halo absolute top-1/2 left-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
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
              sceneReady ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <AiCoreFallback note="Инициализируем ядро…" />
          </div>

          <CanvasErrorBoundary onError={handleSceneError}>
            <div className="core-surface relative z-10 h-full w-full">
              {canRender3d ? (
                <AiCoreStage
                  reducedMotion={reducedMotion}
                  onReady={handleReady}
                  onInteract={handleInteract}
                  onContextLost={handleContextLost}
                />
              ) : null}
            </div>
          </CanvasErrorBoundary>

          {/* Discoverability for the drag gesture; gone after the first touch. */}
          <p
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-1 z-30 flex items-center gap-2 rounded-full border border-graphite-700/70 bg-graphite-950/70 px-3.5 py-1.5 font-mono text-[0.58rem] tracking-[0.2em] text-slate-500 uppercase backdrop-blur-sm transition-opacity duration-500 ${
              sceneReady && !hintDismissed && !reducedMotion
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <span className="h-1 w-1 rounded-full bg-cyan-electric" />
            Потяните ядро · коснитесь для импульса
          </p>
        </>
      )}

      <figcaption className="sr-only">
        NEXUS AI Core: графитовое ядро в кольцах из циана и фиолетового. Ядро
        медленно вращается, отзывается на перетаскивание, на прокрутку
        страницы и выпускает импульс по касанию.
      </figcaption>
    </figure>
  );
}
