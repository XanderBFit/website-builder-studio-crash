import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

const memoryFallback: Record<string, string> = {};
const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(name);
    }
    return memoryFallback[name] ?? null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(name, value);
    } else {
      memoryFallback[name] = value;
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(name);
    } else {
      delete memoryFallback[name];
    }
  },
};

export type AestheticStyle = 'brutalist' | 'editorial' | 'kinetic' | 'spatial' | 'cyber' | 'minimal';
export type ColorThemeId = 'obsidian-lime' | 'alabaster-ink' | 'tokyo-cyber' | 'editorial-warm' | 'cobalt-matrix' | 'monolith-chrome';
export type RenderDimension = '3d-webgl' | '2d-editorial' | 'hybrid-sync';
export type CanvasEngine = 'r3f-drei' | 'tsl-webgpu' | 'gaussian-splat' | 'spline-scene' | 'unicorn-studio';
export type GeometryPrimitive = 'torus-knot' | 'icosahedron-crystal' | 'metaball-cluster' | 'cyber-monolith' | 'gaussian-pointcloud' | 'architectural-ring';
export type MediaShaderMode = 'curtains-liquid' | 'rgb-shift-hover' | 'video-reel-slab' | 'parallax-depth' | 'halftone-matrix';
export type MotionScrollPreset = 'lenis-butter' | 'gsap-pin-scrub' | 'snap-kinetic' | 'zero-gravity';
export type PhysicsMode = 'rapier-rigid' | 'zero-g-attractor' | 'spring-verlet' | 'orbital-choreography';
export type TypographyKineticMode = 'split-char-stagger' | 'troika-3d-msdf' | 'velocity-skew' | 'scramble-decode';
export type AudioSynthPreset = 'minimal-clicks' | 'harmonic-ambient' | 'cyber-glitch' | 'muted';
export type RoutingTransitionMode = 'view-transitions-morph' | 'barba-curtain' | 'shader-dissolve' | 'camera-portal';
export type CompressionPreset = 'draco-ktx2-ultra' | 'meshopt-fast' | 'uncompressed-raw';

export interface ColorThemeSpec {
  id: ColorThemeId;
  name: string;
  subtitle: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  secondary: string;
  border: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ColorThemeSpec> = {
  'obsidian-lime': {
    id: 'obsidian-lime',
    name: 'Obsidian & Acid Lime',
    subtitle: 'Studio Crash Signature Dark',
    bg: '#060608',
    surface: '#101015',
    text: '#F4F4F0',
    muted: '#888894',
    accent: '#CCFF00',
    secondary: '#00F0FF',
    border: 'rgba(255,255,255,0.1)',
  },
  'alabaster-ink': {
    id: 'alabaster-ink',
    name: 'Alabaster & Archival Ink',
    subtitle: 'High-Fashion Editorial Light',
    bg: '#F4F2ED',
    surface: '#E6E3DC',
    text: '#111113',
    muted: '#605E5A',
    accent: '#FF3300',
    secondary: '#1D3557',
    border: 'rgba(17,17,19,0.12)',
  },
  'tokyo-cyber': {
    id: 'tokyo-cyber',
    name: 'Neo-Tokyo Neural',
    subtitle: 'WebGPU Bioluminescent',
    bg: '#05040D',
    surface: '#0E0B22',
    text: '#F0F4FF',
    muted: '#7B7896',
    accent: '#FF0055',
    secondary: '#7000FF',
    border: 'rgba(255,0,85,0.2)',
  },
  'editorial-warm': {
    id: 'editorial-warm',
    name: 'Espresso & Gold Leaf',
    subtitle: 'Luxury Architectural Atelier',
    bg: '#0E0C0A',
    surface: '#191613',
    text: '#F5EFE6',
    muted: '#9A9083',
    accent: '#E2B86B',
    secondary: '#C86D51',
    border: 'rgba(226,184,107,0.15)',
  },
  'cobalt-matrix': {
    id: 'cobalt-matrix',
    name: 'Hyper Cobalt & Signal',
    subtitle: 'Swiss Kinetic Grid',
    bg: '#04091A',
    surface: '#0B1536',
    text: '#FFFFFF',
    muted: '#7E96C4',
    accent: '#00FF88',
    secondary: '#2B59FF',
    border: 'rgba(0,255,136,0.18)',
  },
  'monolith-chrome': {
    id: 'monolith-chrome',
    name: 'Liquid Chrome Monolith',
    subtitle: 'Industrial Silver & Carbon',
    bg: '#0A0B0D',
    surface: '#15171C',
    text: '#E8ECF2',
    muted: '#78808E',
    accent: '#FFFFFF',
    secondary: '#526077',
    border: 'rgba(255,255,255,0.14)',
  },
};

export interface StudioProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  metrics: string;
  description: string;
  color: string;
}

export interface StudioConfigState {
  // Navigation & Wizard Flow
  currentStep: number; // 0 to 8
  studioMode: 'wizard' | 'split-studio' | 'full-site' | 'code-export';
  activePreviewPage: 'home' | 'works' | 'technology' | 'contact';
  isTransitioningRoute: boolean;

  // Step 0: Welcome & Brand Identity
  userName: string;
  brandName: string;
  websiteUrl: string;
  brandTagline: string;
  industry: string;
  brandManifesto: string;
  ctaPrimary: string;

  // Step 1: Style & Color Theme
  aestheticStyle: AestheticStyle;
  colorTheme: ColorThemeId;
  fontPairing: 'syne-grotesk' | 'instrument-serif' | 'jetbrains-tech';
  gridOverlay: boolean;

  // Step 2: Elements & Architecture
  navLayout: 'floating-pill' | 'brutalist-border' | 'minimal-corners';
  heroLayout: 'center-monolith' | 'editorial-asymmetric' | 'kinetic-marquee';
  enableCustomCursor: boolean;
  enableMagneticButtons: boolean;
  enableStatusTicker: boolean;
  showBentoSpecs: boolean;

  // Step 3: 2D OR 3D Dimension
  dimensionMode: RenderDimension;
  depthIntensity: number; // 0 to 1
  cameraFov: number;
  wireframeOverlay: boolean;

  // Step 4: Canvas, Shaders & Postprocessing
  canvasEngine: CanvasEngine;
  geometryPrimitive: 'torus-knot' | 'icosahedron-crystal' | 'metaball-cluster' | 'cyber-monolith' | 'gaussian-pointcloud' | 'architectural-ring';
  shaderMaterial: 'iridescent-transmission' | 'tsl-plasma-displace' | 'liquid-chrome' | 'wireframe-hologram';
  postBloom: boolean;
  postChromatic: boolean;
  postNoiseGrain: boolean;
  postVignette: boolean;
  bloomIntensity: number;
  distortionStrength: number;

  // Step 5: Images, Videos & DOM-to-GL Sync
  mediaShaderMode: MediaShaderMode;
  enableTroika3DText: boolean;
  enableVideoReelPlane: boolean;
  mediaHoverDistortion: number;
  activeMediaFilter: 'none' | 'duotone-accent' | 'high-contrast-mono' | 'cyber-matrix';

  // Step 6: Motion, Scroll, Theatre.js & Physics
  motionScrollPreset: MotionScrollPreset;
  physicsMode: PhysicsMode;
  typographyKineticMode: TypographyKineticMode;
  theatreCameraPath: 'orbit-cinematic' | 'dolly-zoom' | 'top-down-architect' | 'free-interactive';
  enableRiveInteractiveBadge: boolean;
  physicsImpulseCounter: number;

  // Step 7: Sensory, Audio & Routing
  audioPreset: AudioSynthPreset;
  audioVolume: number;
  routingTransition: RoutingTransitionMode;
  compressionPreset: CompressionPreset;

  // Step 8: Export & Live Preview
  projects: StudioProjectItem[];

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStudioMode: (mode: 'wizard' | 'split-studio' | 'full-site' | 'code-export') => void;
  setActivePreviewPage: (page: 'home' | 'works' | 'technology' | 'contact') => void;
  updateConfig: <K extends keyof StudioConfigState>(key: K, value: StudioConfigState[K]) => void;
  triggerPhysicsImpulse: () => void;
  applyQuickPreset: (preset: 'award-agency' | 'editorial-luxury' | 'webgpu-lab' | 'kinetic-brutalist') => void;
}

export const DEFAULT_PROJECTS: StudioProjectItem[] = [
  {
    id: '01',
    title: 'AETHERIA SPATIAL OS',
    category: 'WebGPU / TSL Node Shaders / 3D Gaussian Splatting',
    year: '2026',
    metrics: '120 FPS • 1.8MB .SPZ',
    description: 'Real-time neural radiance architectural walkthrough powered by Three.js Shading Language and Rapier WASM rigid-body dynamics.',
    color: '#CCFF00',
  },
  {
    id: '02',
    title: 'KINETIC MONOLITH // 09',
    category: 'GSAP ScrollTrigger / Lenis / Curtains.js DOM Sync',
    year: '2026',
    metrics: 'SOTD & FWA OF THE DAY',
    description: 'Zero-latency DOM-to-WebGL image planes with velocity-driven RGB chromatic shift and Troika MSDF 3D typography.',
    color: '#00F0FF',
  },
  {
    id: '03',
    title: 'SYNTHESIS AUDIO LABS',
    category: 'Web Audio API / Rive State Machine / Theatre.js',
    year: '2026',
    metrics: '99.8 LIGHTHOUSE PERF',
    description: 'Procedural polyphonic micro-SFX engine synchronized with keyframed 3D camera rigs and native View Transitions API.',
    color: '#FF0055',
  },
  {
    id: '04',
    title: 'VERITAS EDITORIAL ARCHIVE',
    category: 'SplitType Kinetic / Postprocessing RenderPipeline',
    year: '2026',
    metrics: 'DRACO + KTX2 ULTRA',
    description: 'High-contrast brutalist publication blending physical glass refraction, film grain shaders, and physics-reactive artifacts.',
    color: '#E2B86B',
  },
];

export const useStudioStore = create<StudioConfigState>()(
  persist(
    (set) => ({
      currentStep: 0,
      studioMode: 'split-studio',
      activePreviewPage: 'home',
      isTransitioningRoute: false,

      userName: 'Alex Mercer',
      brandName: 'STUDIO CRASH',
      websiteUrl: 'https://studiocrash.design',
      brandTagline: 'ARCHITECTING DIGITAL GRAVITY & REAL-TIME SPATIAL EXPERIENCES',
      industry: 'Creative Technology & Digital Architecture Studio',
      brandManifesto:
        'We fuse WebGPU compute shaders, physical rigid-body simulations, and editorial typography into living websites that shatter static templates.',
      ctaPrimary: 'INITIATE PROJECT // 2026',

      aestheticStyle: 'kinetic',
      colorTheme: 'obsidian-lime',
      fontPairing: 'syne-grotesk',
      gridOverlay: true,

      navLayout: 'floating-pill',
      heroLayout: 'center-monolith',
      enableCustomCursor: true,
      enableMagneticButtons: true,
      enableStatusTicker: true,
      showBentoSpecs: true,

      dimensionMode: 'hybrid-sync',
      depthIntensity: 0.85,
      cameraFov: 42,
      wireframeOverlay: false,

      canvasEngine: 'tsl-webgpu',
      geometryPrimitive: 'torus-knot',
      shaderMaterial: 'iridescent-transmission',
      postBloom: true,
      postChromatic: true,
      postNoiseGrain: true,
      postVignette: true,
      bloomIntensity: 1.35,
      distortionStrength: 0.45,

      mediaShaderMode: 'curtains-liquid',
      enableTroika3DText: true,
      enableVideoReelPlane: true,
      mediaHoverDistortion: 0.65,
      activeMediaFilter: 'none',

      motionScrollPreset: 'lenis-butter',
      physicsMode: 'rapier-rigid',
      typographyKineticMode: 'split-char-stagger',
      theatreCameraPath: 'orbit-cinematic',
      enableRiveInteractiveBadge: true,
      physicsImpulseCounter: 0,

      audioPreset: 'harmonic-ambient',
      audioVolume: 0.4,
      routingTransition: 'view-transitions-morph',
      compressionPreset: 'draco-ktx2-ultra',

      projects: DEFAULT_PROJECTS,

      setStep: (step) => set({ currentStep: Math.max(0, Math.min(8, step)) }),
      nextStep: () => set((s) => ({ currentStep: Math.min(8, s.currentStep + 1) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      setStudioMode: (studioMode) => set({ studioMode }),
      setActivePreviewPage: (page) => {
        set({ isTransitioningRoute: true });
        setTimeout(() => {
          set({ activePreviewPage: page, isTransitioningRoute: false });
        }, 280);
      },
      updateConfig: (key, value) => set({ [key]: value } as Partial<StudioConfigState>),
      triggerPhysicsImpulse: () => set((s) => ({ physicsImpulseCounter: s.physicsImpulseCounter + 1 })),
      applyQuickPreset: (preset) => {
        if (preset === 'award-agency') {
          set({
            aestheticStyle: 'kinetic',
            colorTheme: 'obsidian-lime',
            fontPairing: 'syne-grotesk',
            dimensionMode: 'hybrid-sync',
            canvasEngine: 'tsl-webgpu',
            geometryPrimitive: 'torus-knot',
            shaderMaterial: 'iridescent-transmission',
            postBloom: true,
            postChromatic: true,
            mediaShaderMode: 'curtains-liquid',
            physicsMode: 'rapier-rigid',
            routingTransition: 'view-transitions-morph',
          });
        } else if (preset === 'editorial-luxury') {
          set({
            aestheticStyle: 'editorial',
            colorTheme: 'alabaster-ink',
            fontPairing: 'instrument-serif',
            dimensionMode: '2d-editorial',
            canvasEngine: 'r3f-drei',
            geometryPrimitive: 'architectural-ring',
            shaderMaterial: 'liquid-chrome',
            postBloom: false,
            postChromatic: false,
            mediaShaderMode: 'parallax-depth',
            physicsMode: 'spring-verlet',
            routingTransition: 'barba-curtain',
          });
        } else if (preset === 'webgpu-lab') {
          set({
            aestheticStyle: 'cyber',
            colorTheme: 'tokyo-cyber',
            fontPairing: 'jetbrains-tech',
            dimensionMode: '3d-webgl',
            canvasEngine: 'gaussian-splat',
            geometryPrimitive: 'gaussian-pointcloud',
            shaderMaterial: 'tsl-plasma-displace',
            postBloom: true,
            postChromatic: true,
            mediaShaderMode: 'rgb-shift-hover',
            physicsMode: 'zero-g-attractor',
            routingTransition: 'camera-portal',
          });
        } else if (preset === 'kinetic-brutalist') {
          set({
            aestheticStyle: 'brutalist',
            colorTheme: 'cobalt-matrix',
            fontPairing: 'syne-grotesk',
            dimensionMode: 'hybrid-sync',
            canvasEngine: 'unicorn-studio',
            geometryPrimitive: 'cyber-monolith',
            shaderMaterial: 'wireframe-hologram',
            postBloom: true,
            postChromatic: true,
            mediaShaderMode: 'halftone-matrix',
            physicsMode: 'rapier-rigid',
            routingTransition: 'shader-dissolve',
          });
        }
      },
    }),
    {
      name: 'studio-crash-master-config-v1',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
