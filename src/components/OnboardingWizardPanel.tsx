import React, { useState } from 'react';
import {
  useStudioStore,
  COLOR_THEMES,
  ColorThemeId,
  AestheticStyle,
  RenderDimension,
  CanvasEngine,
  GeometryPrimitive,
  MediaShaderMode,
  MotionScrollPreset,
  PhysicsMode,
  TypographyKineticMode,
  AudioSynthPreset,
  RoutingTransitionMode,
  CompressionPreset,
} from '../store/useStudioStore';
import { soundEngine } from '../utils/soundEngine';
import {
  Sparkles,
  Palette,
  LayoutGrid,
  Box,
  Cpu,
  Image as ImageIcon,
  Activity,
  Volume2,
  Code2,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Globe,
  User,
  Building2,
  Copy,
  CheckCircle2,
  Wand2,
  Layers,
  Eye,
} from 'lucide-react';

export const WIZARD_STEPS = [
  { id: 0, short: '01. Welcome', title: 'Hello & Brand Identity', icon: User },
  { id: 1, short: '02. Style & Color', title: 'Aesthetic & Color Themes', icon: Palette },
  { id: 2, short: '03. Elements', title: 'UI Elements & Architecture', icon: LayoutGrid },
  { id: 3, short: '04. 2D or 3D', title: 'Spatial Dimension Mode', icon: Box },
  { id: 4, short: '05. Canvas & GPU', title: '3D Canvas, TSL & Shaders', icon: Cpu },
  { id: 5, short: '06. Media Sync', title: 'Images, Videos & DOM-to-GL', icon: ImageIcon },
  { id: 6, short: '07. Motion & Physics', title: 'GSAP, Lenis, Theatre & Rapier', icon: Activity },
  { id: 7, short: '08. Sensory & Route', title: 'Web Audio, Transitions & Draco', icon: Volume2 },
  { id: 8, short: '09. Blueprint', title: 'Master Architecture & Code Export', icon: Code2 },
];

export const OnboardingWizardPanel: React.FC = () => {
  const state = useStudioStore();
  const theme = COLOR_THEMES[state.colorTheme];
  const [copiedCode, setCopiedCode] = useState(false);

  const playClick = () => {
    soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
  };

  const playHover = () => {
    soundEngine.playInteraction('hover', state.audioPreset, state.audioVolume);
  };

  const generatedArchitectureCode = `// ============================================================================
// ${state.brandName.toUpperCase()} — STUDIO CRASH MASTER ENGINE BLUEPRINT (2026)
// Architect: ${state.userName || 'Lead Creator'} | URL: ${state.websiteUrl || 'https://studiocrash.design'}
// Industry: ${state.industry}
// ============================================================================

import { Canvas } from '@react-three/fiber';
import { Environment, Float, Text, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const STUDIO_CONFIG = {
  brand: {
    name: ${JSON.stringify(state.brandName)},
    tagline: ${JSON.stringify(state.brandTagline)},
    website: ${JSON.stringify(state.websiteUrl)},
    aesthetic: '${state.aestheticStyle}',
    colorTheme: '${state.colorTheme}',
  },
  canvasAndGpu: {
    dimensionMode: '${state.dimensionMode}',
    engine: '${state.canvasEngine}',
    primitive: '${state.geometryPrimitive}',
    shaderMaterial: '${state.shaderMaterial}',
    fov: ${state.cameraFov},
    postprocessing: {
      bloom: ${state.postBloom},
      bloomIntensity: ${state.bloomIntensity},
      chromaticAberration: ${state.postChromatic},
      filmGrain: ${state.postNoiseGrain},
      vignette: ${state.postVignette},
    },
  },
  domToGlMedia: {
    shaderPlaneMode: '${state.mediaShaderMode}',
    troika3dTypography: ${state.enableTroika3DText},
    videoReelPlane: ${state.enableVideoReelPlane},
    uvDisplacement: ${state.mediaHoverDistortion},
  },
  motionAndPhysics: {
    scrollEngine: '${state.motionScrollPreset}',
    physicsWorld: '${state.physicsMode}',
    theatreCameraRig: '${state.theatreCameraPath}',
    kineticTypography: '${state.typographyKineticMode}',
    riveStateMachine: ${state.enableRiveInteractiveBadge},
  },
  sensoryAndRouting: {
    webAudioPreset: '${state.audioPreset}',
    routerTransition: '${state.routingTransition}',
    assetCompression: '${state.compressionPreset}',
  }
};`;

  const copyBlueprint = () => {
    navigator.clipboard.writeText(generatedArchitectureCode);
    setCopiedCode(true);
    playClick();
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#09090D] text-[#F4F4F0] border-r border-white/10 select-none">
      {/* Wizard Header & Quick Presets */}
      <div className="p-4 border-b border-white/10 space-y-3 bg-[#060609]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: theme.accent }}
            />
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-white">
              STUDIO CRASH // ONBOARDING ARCHITECT
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/70">
            STEP {state.currentStep + 1} OF {WIZARD_STEPS.length}
          </span>
        </div>

        {/* Horizontal Step Pill Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {WIZARD_STEPS.map((st) => {
            const Icon = st.icon;
            const active = state.currentStep === st.id;
            const completed = state.currentStep > st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  state.setStep(st.id);
                  playClick();
                }}
                onMouseEnter={playHover}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  active
                    ? 'bg-white text-black font-bold border-white shadow-lg'
                    : completed
                    ? 'bg-white/10 text-white border-white/15'
                    : 'bg-white/[0.03] text-white/50 border-white/5 hover:text-white/80'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{st.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* STEP 0: HELLO & WELCOME + BRAND IDENTITY */}
        {state.currentStep === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-transparent space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#CCFF00]/15 text-[#CCFF00]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hello & Welcome to Studio Crash</span>
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight">
                Let’s architect your award-winning digital experience.
              </h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Welcome! Every choice you make below immediately rewires the live WebGL/WebGPU 3D
                canvas, shader planes, kinetic typography, physics engine, and audio synthesizer in
                real time on the right. Start by introducing yourself and your brand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Your Name / Creative Director Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={state.userName}
                    onChange={(e) => state.updateConfig('userName', e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Brand / Studio Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={state.brandName}
                      onChange={(e) => state.updateConfig('brandName', e.target.value)}
                      placeholder="e.g. STUDIO CRASH"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Existing Website URL (If you have one)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={state.websiteUrl}
                      onChange={(e) => state.updateConfig('websiteUrl', e.target.value)}
                      placeholder="https://yourbrand.com (optional)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Industry / Creative Sector
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Creative Technology & Digital Architecture Studio',
                    'AI & Spatial Computing Product Lab',
                    'Luxury Fashion & Editorial House',
                    'Web3 / Autonomous Fintech Protocol',
                  ].map((ind) => (
                    <button
                      key={ind}
                      onClick={() => {
                        state.updateConfig('industry', ind);
                        playClick();
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        state.industry === ind
                          ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white font-semibold'
                          : 'border-white/10 bg-white/[0.02] text-white/65 hover:border-white/25'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Hero Tagline / Positioning Statement
                </label>
                <input
                  type="text"
                  value={state.brandTagline}
                  onChange={(e) => state.updateConfig('brandTagline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Brand Manifesto / Mission Brief
                </label>
                <textarea
                  rows={2}
                  value={state.brandManifesto}
                  onChange={(e) => state.updateConfig('brandManifesto', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              {/* One-Click Master Archetype Presets */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-2.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Or Test a Full Studio Archetype Preset Instantly:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'award-agency', label: 'SOTD Kinetic Agency', desc: 'Obsidian + TSL + Rapier' },
                    { id: 'editorial-luxury', label: 'Editorial Atelier', desc: 'Alabaster + Serif + Curtain' },
                    { id: 'webgpu-lab', label: 'WebGPU Neural Splat', desc: 'Neo-Tokyo + Gaussian .SPZ' },
                    { id: 'kinetic-brutalist', label: 'Swiss Cyber Brutalist', desc: 'Cobalt + Wireframe + Halftone' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        state.applyQuickPreset(
                          preset.id as 'award-agency' | 'editorial-luxury' | 'webgpu-lab' | 'kinetic-brutalist'
                        );
                        playClick();
                      }}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#CCFF00]/60 text-left transition-all"
                    >
                      <div className="text-xs font-bold text-white">{preset.label}</div>
                      <div className="text-[10px] font-mono text-white/50">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: STYLE CHOICES & COLOR THEMES */}
        {state.currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 02 // VISUAL DIRECTION</span>
              <h2 className="text-xl font-display font-bold mt-1">
                Style Direction & Color Themes
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Select your foundational design language, color atmosphere, and typography pairing.
                Watch the live preview transform immediately.
              </p>
            </div>

            {/* Aesthetic Style Direction */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase text-white/70">
                1. Architectural Style Direction
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'kinetic', title: 'Kinetic Avant-Garde', desc: 'High-velocity typography & WebGL sync' },
                    { id: 'brutalist', title: 'Swiss Neo-Brutalist', desc: 'Exposed grids, raw borders & stark contrast' },
                    { id: 'editorial', title: 'High-Fashion Editorial', desc: 'Serif poise, generous whitespace & poise' },
                    { id: 'spatial', title: 'Spatial Glass OS', desc: 'Refractive depth, transmission & floating HUD' },
                    { id: 'cyber', title: 'Bioluminescent Neural', desc: 'Shader plasma, neon bloom & dark telemetry' },
                    { id: 'minimal', title: 'Monolith Minimal', desc: 'Pure sculptural restraint & micro-motion' },
                  ] as { id: AestheticStyle; title: string; desc: string }[]
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      state.updateConfig('aestheticStyle', st.id);
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      state.aestheticStyle === st.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{st.title}</span>
                      {state.aestheticStyle === st.id && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
                    </div>
                    <div className="text-[11px] text-white/55 mt-1">{st.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Themes with Swatches */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase text-white/70">
                2. Curated Color Theme Palettes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.values(COLOR_THEMES) as typeof COLOR_THEMES[ColorThemeId][]).map((ct) => {
                  const active = state.colorTheme === ct.id;
                  return (
                    <button
                      key={ct.id}
                      onClick={() => {
                        state.updateConfig('colorTheme', ct.id);
                        playClick();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        active
                          ? 'border-white bg-white/10 shadow-lg'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{ct.name}</div>
                        <div className="text-[10px] font-mono text-white/55">{ct.subtitle}</div>
                      </div>
                      <div className="flex items-center -space-x-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-white/30"
                          style={{ backgroundColor: ct.bg }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/30"
                          style={{ backgroundColor: ct.accent }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/30"
                          style={{ backgroundColor: ct.secondary }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Pairing */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase text-white/70">
                3. Display Typography Pairing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'syne-grotesk', label: 'Syne + Space Grotesk', sample: 'DISPLAY BOLD' },
                  { id: 'instrument-serif', label: 'Instrument Serif', sample: 'Editorial Italic' },
                  { id: 'jetbrains-tech', label: 'JetBrains Mono', sample: 'TECH_MONO_01' },
                ].map((fp) => (
                  <button
                    key={fp.id}
                    onClick={() => {
                      state.updateConfig(
                        'fontPairing',
                        fp.id as 'syne-grotesk' | 'instrument-serif' | 'jetbrains-tech'
                      );
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.fontPairing === fp.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{fp.label}</div>
                    <div className="text-[11px] text-white/50 mt-1">{fp.sample}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: UI ELEMENTS & ARCHITECTURE */}
        {state.currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 03 // INTERFACE ELEMENTS</span>
              <h2 className="text-xl font-display font-bold mt-1">
                Structural Elements & Interactive HUD
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Configure navigation chrome, hero composition, magnetic cursor reticles, and bento
                telemetry modules.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-white/70">
                Navigation Chrome Architecture
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'floating-pill', label: 'Floating Glass Pill', desc: 'Blurred dynamic island' },
                  { id: 'brutalist-border', label: 'Brutalist Frame', desc: 'Full-width sharp border' },
                  { id: 'minimal-corners', label: 'Minimal Horizon', desc: 'Clean editorial rule' },
                ].map((nav) => (
                  <button
                    key={nav.id}
                    onClick={() => {
                      state.updateConfig(
                        'navLayout',
                        nav.id as 'floating-pill' | 'brutalist-border' | 'minimal-corners'
                      );
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.navLayout === nav.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{nav.label}</div>
                    <div className="text-[10px] text-white/55 mt-1">{nav.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-white/70">
                Hero Stage Composition
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'center-monolith', label: 'Center Monolith', desc: 'Symmetric 3D centerpiece' },
                  { id: 'editorial-asymmetric', label: 'Asymmetric Split', desc: '8/4 column + live HUD card' },
                  { id: 'kinetic-marquee', label: 'Left Kinetic Poster', desc: 'Oversized brutalist alignment' },
                ].map((hl) => (
                  <button
                    key={hl.id}
                    onClick={() => {
                      state.updateConfig(
                        'heroLayout',
                        hl.id as 'center-monolith' | 'editorial-asymmetric' | 'kinetic-marquee'
                      );
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.heroLayout === hl.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{hl.label}</div>
                    <div className="text-[10px] text-white/55 mt-1">{hl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-mono uppercase text-white/70">
                Interactive Micro-Elements (Toggle Live Examples)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'enableCustomCursor', label: 'Magnetic Reticle Cursor', desc: 'Custom ring follower in viewport' },
                  { key: 'enableMagneticButtons', label: 'Elastic Magnetic CTAs', desc: 'Spring scale on primary actions' },
                  { key: 'enableStatusTicker', label: 'Top Telemetry Bar', desc: 'Live engine & FPS status header' },
                  { key: 'showBentoSpecs', label: 'Architecture Bento Grid', desc: '3-column technical spec cards' },
                  { key: 'gridOverlay', label: 'Infinite 3D Floor Grid', desc: 'Perspective spatial ground plane' },
                ].map((tog) => {
                  const isOn = Boolean(state[tog.key as keyof typeof state]);
                  return (
                    <button
                      key={tog.key}
                      onClick={() => {
                        state.updateConfig(tog.key as keyof typeof state, !isOn as never);
                        playClick();
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        isOn ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{tog.label}</div>
                        <div className="text-[10px] text-white/55">{tog.desc}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          isOn ? 'bg-[#CCFF00] text-black font-bold' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {isOn ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 2D OR 3D DIMENSION */}
        {state.currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 04 // SPATIAL DIMENSION</span>
              <h2 className="text-xl font-display font-bold mt-1">
                2D Editorial, 3D WebGL, or Hybrid DOM-to-GL Sync
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Compare how your brand feels as a pure 2D typographic grid versus a full real-time
                3D WebGL/WebGPU spatial environment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(
                [
                  {
                    id: 'hybrid-sync',
                    title: 'HYBRID DOM-TO-GL SYNC (Recommended)',
                    badge: 'AWWWARDS SOTD STANDARD',
                    desc: 'Combines crisp semantic HTML/Tailwind typography with a persistent background WebGL/WebGPU canvas and synchronized shader cards.',
                  },
                  {
                    id: '3d-webgl',
                    title: 'FULL 3D SPATIAL STAGE',
                    badge: 'IMMERSIVE WEBGPU / R3F',
                    desc: 'Prioritizes the real-time 3D artifact, Troika 3D MSDF text in world-space, and interactive physics bodies.',
                  },
                  {
                    id: '2d-editorial',
                    title: 'PURE 2D ARCHITECTURAL GRID',
                    badge: 'ULTRA-LIGHTWEIGHT 120FPS',
                    desc: 'Disables the 3D WebGL canvas in favor of a radial Swiss grid, kinetic typography, and CSS/SVG micro-interactions.',
                  },
                ] as { id: RenderDimension; title: string; badge: string; desc: string }[]
              ).map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => {
                    state.updateConfig('dimensionMode', dm.id);
                    playClick();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    state.dimensionMode === dm.id
                      ? 'border-[#CCFF00] bg-[#CCFF00]/10 shadow-lg'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{dm.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#CCFF00]">
                      {dm.badge}
                    </span>
                  </div>
                  <p className="text-xs text-white/65 mt-1.5 leading-relaxed">{dm.desc}</p>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>CAMERA FIELD OF VIEW (FOV)</span>
                  <span className="text-[#CCFF00]">{state.cameraFov}°</span>
                </div>
                <input
                  type="range"
                  min={28}
                  max={75}
                  value={state.cameraFov}
                  onChange={(e) => state.updateConfig('cameraFov', Number(e.target.value))}
                  className="w-full accent-[#CCFF00]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <div className="text-xs font-bold">3D Wireframe Diagnostic Overlay</div>
                  <div className="text-[11px] text-white/55">Inspect raw polygon topology in real time</div>
                </div>
                <button
                  onClick={() => {
                    state.updateConfig('wireframeOverlay', !state.wireframeOverlay);
                    playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs ${
                    state.wireframeOverlay ? 'bg-[#CCFF00] text-black font-bold' : 'bg-white/10 text-white'
                  }`}
                >
                  {state.wireframeOverlay ? 'WIREFRAME ON' : 'SOLID SHADED'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CANVAS, TSL SHADERS & POSTPROCESSING */}
        {state.currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 05 // THE CANVAS LAYER</span>
              <h2 className="text-xl font-display font-bold mt-1">
                WebGPU / TSL, 3D Gaussian Splatting & Postprocessing
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Test each 3D engine architecture, centerline geometry, node shader material, and
                postprocessing pass live on the canvas.
              </p>
            </div>

            {/* Canvas Engine */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                1. Primary Canvas Rendering Pipeline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    { id: 'tsl-webgpu', title: 'Three.js + TSL (WebGPU)', desc: 'Node-based WGSL/GLSL shader graph' },
                    { id: 'r3f-drei', title: 'React Three Fiber + Drei', desc: 'Declarative scene graph & transmission' },
                    { id: 'gaussian-splat', title: '3D Gaussian Splatting (.SPZ)', desc: 'Real-time neural radiance point cloud' },
                    { id: 'spline-scene', title: 'Spline Interactive Rig', desc: 'State-driven 3D product embeds' },
                    { id: 'unicorn-studio', title: 'Unicorn Studio Stack', desc: 'Layered WebGL visual effects compositing' },
                  ] as { id: CanvasEngine; title: string; desc: string }[]
                ).map((ce) => (
                  <button
                    key={ce.id}
                    onClick={() => {
                      state.updateConfig('canvasEngine', ce.id);
                      if (ce.id === 'gaussian-splat') {
                        state.updateConfig('geometryPrimitive', 'gaussian-pointcloud');
                      }
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.canvasEngine === ce.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{ce.title}</div>
                    <div className="text-[10px] text-white/55 mt-0.5">{ce.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Hero Artifact Geometry */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                2. 3D Centerpiece Artifact Geometry
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: 'torus-knot', label: 'Hyper Torus Knot' },
                    { id: 'icosahedron-crystal', label: 'Refractive Crystal' },
                    { id: 'gaussian-pointcloud', label: 'Gaussian Splat Cloud' },
                    { id: 'metaball-cluster', label: 'Organic DisplacementOrb' },
                    { id: 'cyber-monolith', label: 'Brutalist Monolith' },
                    { id: 'architectural-ring', label: 'Orbital Halo Ring' },
                  ] as { id: GeometryPrimitive; label: string }[]
                ).map((geo) => (
                  <button
                    key={geo.id}
                    onClick={() => {
                      state.updateConfig('geometryPrimitive', geo.id);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left ${
                      state.geometryPrimitive === geo.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-white font-bold'
                        : 'border-white/10 bg-white/[0.02] text-white/70'
                    }`}
                  >
                    {geo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shader Material */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                3. TSL / Custom Shader Material
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'iridescent-transmission', label: 'Physical Glass Transmission', desc: 'IOR chromatic refraction' },
                  { id: 'tsl-plasma-displace', label: 'TSL Vertex Plasma Displace', desc: 'Simplex noise distortion' },
                  { id: 'liquid-chrome', label: 'Liquid Mirror Chrome', desc: '1.0 metalness reflection' },
                  { id: 'wireframe-hologram', label: 'Holographic Emissive Mesh', desc: 'Additive neon vector lines' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    onClick={() => {
                      state.updateConfig(
                        'shaderMaterial',
                        sh.id as
                          | 'iridescent-transmission'
                          | 'tsl-plasma-displace'
                          | 'liquid-chrome'
                          | 'wireframe-hologram'
                      );
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.shaderMaterial === sh.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{sh.label}</div>
                    <div className="text-[10px] text-white/55">{sh.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Postprocessing RenderPipeline */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="text-xs font-mono uppercase text-[#CCFF00]">
                4. Postprocessing RenderPipeline Passes
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'postBloom', label: 'Unreal Mipmap Bloom' },
                  { key: 'postChromatic', label: 'RGB Chromatic Aberration' },
                  { key: 'postNoiseGrain', label: '35mm Film Grain Shader' },
                  { key: 'postVignette', label: 'Anamorphic Vignette' },
                ].map((pp) => {
                  const on = Boolean(state[pp.key as keyof typeof state]);
                  return (
                    <button
                      key={pp.key}
                      onClick={() => {
                        state.updateConfig(pp.key as keyof typeof state, !on as never);
                        playClick();
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                        on ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-white' : 'border-white/10 text-white/50'
                      }`}
                    >
                      <span>{pp.label}</span>
                      <span>{on ? 'ON' : 'OFF'}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>SHADER DISTORTION & TURBULENCE</span>
                  <span className="text-[#CCFF00]">{Math.round(state.distortionStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={state.distortionStrength}
                  onChange={(e) => state.updateConfig('distortionStrength', Number(e.target.value))}
                  className="w-full accent-[#CCFF00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: IMAGES, VIDEOS & DOM-TO-GL SYNC */}
        {state.currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 06 // MEDIA & DOM-TO-GL SYNC</span>
              <h2 className="text-xl font-display font-bold mt-1">
                Images, Videos, Curtains.js & Troika 3D Text
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Configure how DOM images and video reels synchronize with WebGL shader planes, and
                hover the project cards in the preview to see the effect.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                1. DOM-to-WebGL Media Plane Shader (`r3f-scroll-rig` / `Curtains.js`)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(
                  [
                    {
                      id: 'curtains-liquid',
                      title: 'Curtains.js Liquid UV Ripple',
                      desc: 'Fluid cursor wave displacement across DOM project cards',
                    },
                    {
                      id: 'rgb-shift-hover',
                      title: 'Velocity RGB Chromatic Split',
                      desc: 'Separates R/G/B texture channels based on pointer delta',
                    },
                    {
                      id: 'video-reel-slab',
                      title: 'WebGL Showreel Video Texture Slab',
                      desc: 'Synchronizes 60fps video reel scanline playback with shader planes',
                    },
                    {
                      id: 'parallax-depth',
                      title: 'r3f-scroll-rig 3D Perspective Tilt',
                      desc: 'Synchronizes scroll position with 3D perspective depth planes',
                    },
                    {
                      id: 'halftone-matrix',
                      title: 'GLSL Dot-Matrix Halftone Shader',
                      desc: 'Procedural brutalist raster screen over project imagery',
                    },
                  ] as { id: MediaShaderMode; title: string; desc: string }[]
                ).map((ms) => (
                  <button
                    key={ms.id}
                    onClick={() => {
                      state.updateConfig('mediaShaderMode', ms.id);
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.mediaShaderMode === ms.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{ms.title}</div>
                    <div className="text-[11px] text-white/55">{ms.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  state.updateConfig('enableTroika3DText', !state.enableTroika3DText);
                  playClick();
                }}
                className={`p-3.5 rounded-xl border text-left ${
                  state.enableTroika3DText
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#CCFF00]">troika-three-text</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
                    {state.enableTroika3DText ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="text-sm font-bold mt-0.5">MSDF 3D Spatial Typography</div>
                <div className="text-[11px] text-white/55 mt-1">
                  Renders razor-sharp SDF brand text directly inside the 3D scene behind the artifact.
                </div>
              </button>

              <button
                onClick={() => {
                  state.updateConfig('enableVideoReelPlane', !state.enableVideoReelPlane);
                  playClick();
                }}
                className={`p-3.5 rounded-xl border text-left ${
                  state.enableVideoReelPlane
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#CCFF00]">VideoTexture // Showreel</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
                    {state.enableVideoReelPlane ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="text-sm font-bold mt-0.5">Interactive Showreel Video Slab</div>
                <div className="text-[11px] text-white/55 mt-1">
                  Embeds a live interactive WebGL showreel video player slab in the showcase stream.
                </div>
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>HOVER TILT & UV DISPLACEMENT INTENSITY</span>
                <span className="text-[#CCFF00]">{Math.round(state.mediaHoverDistortion * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={state.mediaHoverDistortion}
                onChange={(e) => state.updateConfig('mediaHoverDistortion', Number(e.target.value))}
                className="w-full accent-[#CCFF00]"
              />
              <div className="text-[10px] text-white/50">
                Move cursor over the 4 archive cards in the showcase to feel the 3D plane tilt.
              </div>
            </div>

            {/* Color Grading Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                Media Post-Grading LUT Filter
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'True Color' },
                  { id: 'duotone-accent', label: 'Duotone LUT' },
                  { id: 'high-contrast-mono', label: 'Noir Mono' },
                  { id: 'cyber-matrix', label: 'Cyber Matrix' },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => {
                      state.updateConfig(
                        'activeMediaFilter',
                        flt.id as 'none' | 'duotone-accent' | 'high-contrast-mono' | 'cyber-matrix'
                      );
                      playClick();
                    }}
                    className={`p-2 rounded-lg border text-xs font-mono ${
                      state.activeMediaFilter === flt.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-white'
                        : 'border-white/10 text-white/60'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: MOTION, SCROLL, THEATRE.JS & PHYSICS */}
        {state.currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 07 // MOTION & PHYSICS LAYER</span>
              <h2 className="text-xl font-display font-bold mt-1">
                GSAP, Lenis, Theatre.js, SplitType, Rive & Rapier WASM
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Orchestrate timelines, 3D camera choreography, rigid-body physics, and kinetic text.
              </p>
            </div>

            {/* Physics Mode + Impulse Trigger */}
            <div className="p-4 rounded-2xl border border-white/15 bg-white/[0.03] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-[#CCFF00]">
                    @react-three/rapier WASM Simulation
                  </div>
                  <div className="text-sm font-bold">3D Orbital & Rigid-Body Physics</div>
                </div>
                <button
                  onClick={() => {
                    state.triggerPhysicsImpulse();
                    soundEngine.playInteraction('impulse', state.audioPreset, state.audioVolume);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#CCFF00] text-black font-mono text-xs font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>FIRE IMPULSE WAVE</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'rapier-rigid', label: 'Rapier Rigid-Body Bounce', desc: 'Gravity + restitution collisions' },
                    { id: 'zero-g-attractor', label: 'Zero-G Cursor Attractor', desc: 'Magnetic orbital swarm around pointer' },
                    { id: 'spring-verlet', label: 'Verlet Spring Lattice', desc: 'Harmonic elastic oscillation' },
                    { id: 'orbital-choreography', label: 'Keplerian Ring Orbit', desc: 'Precision celestial pathing' },
                  ] as { id: PhysicsMode; label: string; desc: string }[]
                ).map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => {
                      state.updateConfig('physicsMode', pm.id);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-left ${
                      state.physicsMode === pm.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{pm.label}</div>
                    <div className="text-[10px] text-white/55">{pm.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theatre.js Camera Path */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                Theatre.js 3D Camera Rig Choreography
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'orbit-cinematic', label: 'Cinematic Crane Orbit' },
                  { id: 'dolly-zoom', label: 'Vertigo Dolly Pulse' },
                  { id: 'top-down-architect', label: 'Architectural Plan View' },
                  { id: 'free-interactive', label: 'Direct Pointer Parallax' },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      state.updateConfig(
                        'theatreCameraPath',
                        cam.id as 'orbit-cinematic' | 'dolly-zoom' | 'top-down-architect' | 'free-interactive'
                      );
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left ${
                      state.theatreCameraPath === cam.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-white font-bold'
                        : 'border-white/10 text-white/70'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SplitType Kinetic Typography */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                SplitType + GSAP Kinetic Typography Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'split-char-stagger', label: 'Interactive Character Lift (Hover letters!)' },
                    { id: 'scramble-decode', label: 'Cyber Cipher Scramble Decode' },
                    { id: 'velocity-skew', label: 'Scroll Velocity Shear Skew' },
                    { id: 'troika-3d-msdf', label: 'Clean Editorial Lockup' },
                  ] as { id: TypographyKineticMode; label: string }[]
                ).map((tk) => (
                  <button
                    key={tk.id}
                    onClick={() => {
                      state.updateConfig('typographyKineticMode', tk.id);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left ${
                      state.typographyKineticMode === tk.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 font-bold'
                        : 'border-white/10 text-white/70'
                    }`}
                  >
                    {tk.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Engine + Rive */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                Scroll Orchestration & Rive State Machine
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'lenis-butter', label: 'Lenis Smooth Inertia (Lerp 0.08)' },
                    { id: 'gsap-pin-scrub', label: 'GSAP ScrollTrigger Scrub' },
                    { id: 'snap-kinetic', label: 'CSS / GSAP Section Snap' },
                    { id: 'zero-gravity', label: 'Zero-G Floating Scroll' },
                  ] as { id: MotionScrollPreset; label: string }[]
                ).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      state.updateConfig('motionScrollPreset', sc.id);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left ${
                      state.motionScrollPreset === sc.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-white font-bold'
                        : 'border-white/10 text-white/60'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  state.updateConfig('enableRiveInteractiveBadge', !state.enableRiveInteractiveBadge);
                  playClick();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  state.enableRiveInteractiveBadge
                    ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Rive Vector State Machine HUD Badge</div>
                  <div className="text-[10px] text-white/55">Interactive state-driven vector emblem in hero</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#CCFF00]">
                  {state.enableRiveInteractiveBadge ? 'ACTIVE' : 'HIDDEN'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SENSORY, WEB AUDIO, ROUTING & DRACO/KTX2 */}
        {state.currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono uppercase text-[#CCFF00]">STEP 08 // SENSORY & ROUTING</span>
              <h2 className="text-xl font-display font-bold mt-1">
                Web Audio Synth, View Transitions API & Asset Compression
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Test procedural UI micro-SFX via the Web Audio API, multi-page Barba/View
                Transitions routing, and GPU asset pipelines.
              </p>
            </div>

            {/* Web Audio Synthesizer */}
            <div className="p-4 rounded-2xl border border-white/15 bg-white/[0.03] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-[#CCFF00]">
                    Web Audio API / Tone.js Procedural Synth
                  </div>
                  <div className="text-sm font-bold">Interactive Sound Design Profile</div>
                </div>
                <button
                  onClick={() =>
                    soundEngine.playInteraction('select', state.audioPreset, state.audioVolume)
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#CCFF00]"
                >
                  🔊 TEST SYNTH CHORD
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'harmonic-ambient', label: 'Harmonic Fifths Chord', desc: 'Warm polyphonic sine/triangle' },
                    { id: 'minimal-clicks', label: 'Tactile Micro-Clicks', desc: 'Crisp high-frequency UI ticks' },
                    { id: 'cyber-glitch', label: 'Cyber Bandpass Synth', desc: 'Sawtooth frequency sweep' },
                    { id: 'muted', label: 'Silent Mode (Muted)', desc: 'Zero audio output' },
                  ] as { id: AudioSynthPreset; label: string; desc: string }[]
                ).map((ap) => (
                  <button
                    key={ap.id}
                    onClick={() => {
                      state.updateConfig('audioPreset', ap.id);
                      soundEngine.playInteraction('select', ap.id, state.audioVolume);
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.audioPreset === ap.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{ap.label}</div>
                    <div className="text-[10px] text-white/55">{ap.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Routing Transitions */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                Page Routing Choreography (Click Home / Works / Tech in Showcase Nav!)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'view-transitions-morph', label: 'Native View Transitions API', desc: 'document.startViewTransition' },
                    { id: 'barba-curtain', label: 'Barba.js Wipe Curtain', desc: 'Seamless PJAX lifecycle' },
                    { id: 'shader-dissolve', label: 'GLSL Radial Dissolve', desc: 'Accent bloom transition' },
                    { id: 'camera-portal', label: '3D Conic Portal Warp', desc: 'Camera fly-through feel' },
                  ] as { id: RoutingTransitionMode; label: string; desc: string }[]
                ).map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => {
                      state.updateConfig('routingTransition', rt.id);
                      playClick();
                    }}
                    className={`p-3 rounded-xl border text-left ${
                      state.routingTransition === rt.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-xs font-bold">{rt.label}</div>
                    <div className="text-[10px] text-white/55">{rt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Compression */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70">
                3D Geometry & Texture Compression Pipeline
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'draco-ktx2-ultra', label: 'Draco + KTX2 Basis' },
                    { id: 'meshopt-fast', label: 'Meshopt + WebP' },
                    { id: 'uncompressed-raw', label: 'Raw GLTF Studio' },
                  ] as { id: CompressionPreset; label: string }[]
                ).map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => {
                      state.updateConfig('compressionPreset', cp.id);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono ${
                      state.compressionPreset === cp.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 font-bold'
                        : 'border-white/10 text-white/60'
                    }`}
                  >
                    {cp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: MASTER BLUEPRINT & CODE EXPORT */}
        {state.currentStep === 8 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#CCFF00]">
                  STEP 09 // READY FOR PRODUCTION
                </span>
                <h2 className="text-xl font-display font-bold mt-1">
                  {state.brandName} — Master Engine Blueprint
                </h2>
              </div>
              <button
                onClick={() => state.setStudioMode('full-site')}
                className="px-3.5 py-2 rounded-xl bg-[#CCFF00] text-black font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LAUNCH FULLSCREEN SITE</span>
              </button>
            </div>

            <p className="text-xs text-white/65 leading-relaxed">
              Your custom Studio Crash configuration is complete and active in the viewport. Copy
              the generated TypeScript configuration below or switch to Fullscreen Site mode to
              experience your bespoke build.
            </p>

            <div className="relative rounded-2xl border border-white/15 bg-[#050507] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                <span className="font-mono text-[11px] text-white/70">
                  studio-crash.config.ts
                </span>
                <button
                  onClick={copyBlueprint}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1.5 text-[#CCFF00]"
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY BLUEPRINT</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono text-white/85 overflow-x-auto max-h-[320px] leading-relaxed">
                <code>{generatedArchitectureCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="p-4 border-t border-white/10 bg-[#060609] flex items-center justify-between gap-3">
        <button
          onClick={() => {
            state.prevStep();
            playClick();
          }}
          disabled={state.currentStep === 0}
          className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase flex items-center gap-1.5 disabled:opacity-30 hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREV STEP</span>
        </button>

        <div className="flex items-center gap-1.5">
          {WIZARD_STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => state.setStep(s.id)}
              className={`h-1.5 rounded-full transition-all ${
                state.currentStep === s.id
                  ? 'w-6 bg-[#CCFF00]'
                  : state.currentStep > s.id
                  ? 'w-2 bg-white/50'
                  : 'w-2 bg-white/15'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {state.currentStep < WIZARD_STEPS.length - 1 ? (
          <button
            onClick={() => {
              state.nextStep();
              playClick();
            }}
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-transform active:scale-95"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            <span>NEXT: {WIZARD_STEPS[state.currentStep + 1].short.split('. ')[1]}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              state.setStudioMode('full-site');
              playClick();
            }}
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase flex items-center gap-1.5"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            <span>ENTER FULL EXPERIENCE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
