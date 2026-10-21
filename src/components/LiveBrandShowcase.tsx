import React, { useState, useRef, useEffect } from 'react';
import {
  useStudioStore,
  COLOR_THEMES,
  StudioProjectItem,
} from '../store/useStudioStore';
import { StudioWebGLCanvas } from './StudioWebGLCanvas';
import { soundEngine } from '../utils/soundEngine';
import {
  Sparkles,
  ArrowUpRight,
  Cpu,
  Layers,
  Activity,
  Volume2,
  VolumeX,
  Compass,
  Zap,
  Globe,
  ShieldCheck,
  Terminal,
  Play,
  Eye,
  Move3d,
  Boxes,
  Radio,
} from 'lucide-react';

// Interactive Rive-style Vector State Machine Badge
const RiveInteractiveStateMachineBadge: React.FC<{ accent: string; text: string }> = ({
  accent,
  text,
}) => {
  const [riveState, setRiveState] = useState<'IDLE' | 'HOVER_WARP' | 'ENGAGED'>('IDLE');
  const [energy, setEnergy] = useState(72);

  return (
    <div
      onMouseEnter={() => setRiveState('HOVER_WARP')}
      onMouseLeave={() => setRiveState('IDLE')}
      onClick={() => {
        setRiveState('ENGAGED');
        setEnergy((e) => (e >= 99 ? 64 : e + 12));
      }}
      className="cursor-pointer select-none inline-flex items-center gap-3 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: riveState !== 'IDLE' ? accent : 'rgba(255,255,255,0.16)',
        background: 'rgba(10,10,16,0.68)',
        transform: riveState === 'ENGAGED' ? 'scale(1.05)' : riveState === 'HOVER_WARP' ? 'scale(1.02)' : 'scale(1)',
      }}
      title="Click to toggle Rive State Machine transition"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeDasharray={riveState === 'ENGAGED' ? '80 10' : riveState === 'HOVER_WARP' ? '50 25' : '25 45'}
            className="transition-all duration-500 origin-center animate-spin-slow"
          />
          <polygon
            points="18,8 26,24 10,24"
            fill={riveState === 'ENGAGED' ? accent : 'transparent'}
            stroke={accent}
            strokeWidth="1.8"
            className="transition-all duration-300 origin-center"
            style={{
              transform: riveState === 'HOVER_WARP' ? 'rotate(60deg)' : riveState === 'ENGAGED' ? 'rotate(180deg)' : 'rotate(0deg)',
              transformOrigin: '18px 18px',
            }}
          />
        </svg>
      </div>
      <div className="text-left">
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-65" style={{ color: text }}>
          RIVE STATE MACHINE // {riveState}
        </div>
        <div className="text-xs font-mono font-semibold flex items-center gap-2" style={{ color: accent }}>
          <span>SYNC: {energy}%</span>
          <span className="text-[10px] opacity-75">[CLICK TO TRIGGER]</span>
        </div>
      </div>
    </div>
  );
};

// Curtains.js / r3f-scroll-rig DOM-to-WebGL Shader Plane Card
const ShaderMediaCard: React.FC<{
  project: StudioProjectItem;
  index: number;
}> = ({ project, index }) => {
  const {
    mediaShaderMode,
    mediaHoverDistortion,
    activeMediaFilter,
    colorTheme,
    audioPreset,
    audioVolume,
  } = useStudioStore();
  const theme = COLOR_THEMES[colorTheme];
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const tiltX = hovered ? (mousePos.y - 0.5) * -14 * mediaHoverDistortion : 0;
  const tiltY = hovered ? (mousePos.x - 0.5) * 14 * mediaHoverDistortion : 0;

  const filterStyle =
    activeMediaFilter === 'duotone-accent'
      ? 'sepia(80%) hue-rotate(50deg) saturate(220%)'
      : activeMediaFilter === 'high-contrast-mono'
      ? 'grayscale(100%) contrast(150%)'
      : activeMediaFilter === 'cyber-matrix'
      ? 'hue-rotate(140deg) saturate(260%) contrast(120%)'
      : 'none';

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
        soundEngine.playInteraction('hover', audioPreset, audioVolume);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl overflow-hidden border transition-all duration-300 p-6 flex flex-col justify-between min-h-[290px]"
      style={{
        borderColor: hovered ? theme.accent : theme.border,
        backgroundColor: theme.surface,
        transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hovered ? 1.015 : 1})`,
        filter: filterStyle,
      }}
    >
      {/* Simulated Curtains.js / WebGL Fragment Shader Plane Background */}
      <div
        className="absolute inset-0 opacity-35 transition-all duration-500 pointer-events-none"
        style={{
          background:
            mediaShaderMode === 'curtains-liquid'
              ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${project.color}55, transparent 65%), linear-gradient(135deg, ${theme.surface}, ${theme.bg})`
              : mediaShaderMode === 'rgb-shift-hover'
              ? `linear-gradient(${hovered ? mousePos.x * 360 : 45}deg, #ff005544, #00f0ff44, ${project.color}33)`
              : mediaShaderMode === 'halftone-matrix'
              ? `radial-gradient(${project.color} 1.5px, transparent 1.5px)`
              : `linear-gradient(160deg, ${project.color}33 0%, transparent 70%)`,
          backgroundSize: mediaShaderMode === 'halftone-matrix' ? '12px 12px' : '100% 100%',
        }}
      />

      {/* RGB Split Chromatic Ghost Layer when hovered */}
      {hovered && (mediaShaderMode === 'rgb-shift-hover' || mediaShaderMode === 'curtains-liquid') && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 transition-transform"
          style={{
            border: `1px solid ${project.color}`,
            transform: `translate(${(mousePos.x - 0.5) * 16}px, ${(mousePos.y - 0.5) * 16}px)`,
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <span
          className="font-mono text-xs px-2.5 py-1 rounded border"
          style={{
            borderColor: theme.border,
            color: project.color,
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        >
          ARCHIVE // {project.id} • {project.year}
        </span>
        <span className="font-mono text-[11px] opacity-70" style={{ color: theme.text }}>
          {project.metrics}
        </span>
      </div>

      <div className="relative z-10 my-6">
        <div className="text-xs font-mono uppercase tracking-wider mb-1 opacity-70" style={{ color: theme.muted }}>
          {project.category}
        </div>
        <h3
          className="text-2xl md:text-3xl font-bold tracking-tight transition-transform duration-300 flex items-center gap-2"
          style={{
            color: theme.text,
            transform: hovered ? 'translateX(6px)' : 'none',
          }}
        >
          <span>{project.title}</span>
          <ArrowUpRight
            className="w-5 h-5 transition-transform duration-300"
            style={{
              color: theme.accent,
              transform: hovered ? 'translate(3px, -3px)' : 'none',
            }}
          />
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed opacity-80" style={{ color: theme.muted }}>
          {project.description}
        </p>
      </div>

      <div className="relative z-10 pt-3 border-t flex items-center justify-between text-[11px] font-mono" style={{ borderColor: theme.border }}>
        <span style={{ color: theme.accent }}>
          SHADER PLANE: {mediaShaderMode.toUpperCase()} #{index + 1}
        </span>
        <span className="opacity-65" style={{ color: theme.text }}>
          UV({mousePos.x.toFixed(2)}, {mousePos.y.toFixed(2)})
        </span>
      </div>
    </div>
  );
};

export const LiveBrandShowcase: React.FC = () => {
  const state = useStudioStore();
  const theme = COLOR_THEMES[state.colorTheme];
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorCoords, setCursorCoords] = useState({ x: 300, y: 220 });
  const [scrambleText, setScrambleText] = useState(state.brandName);

  // Kinetic Typography Scramble / Decode effect when typography mode or brandName changes
  useEffect(() => {
    const target = (state.brandName || 'STUDIO CRASH').toUpperCase();
    if (state.typographyKineticMode !== 'scramble-decode') {
      setScrambleText(target);
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//<>#%';
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambleText(
        target
          .split('')
          .map((letter, idx) => {
            if (letter === ' ') return ' ';
            if (idx < iteration) return target[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 0.45;
      if (iteration >= target.length) {
        clearInterval(interval);
        setScrambleText(target);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [state.brandName, state.typographyKineticMode]);

  const fontClass =
    state.fontPairing === 'instrument-serif'
      ? 'font-serif'
      : state.fontPairing === 'jetbrains-tech'
      ? 'font-mono'
      : 'font-display';

  const handlePageSwitch = (page: 'home' | 'works' | 'technology' | 'contact') => {
    soundEngine.playInteraction('transition', state.audioPreset, state.audioVolume);
    // Use native View Transitions API if supported
    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (docWithVT.startViewTransition && state.routingTransition === 'view-transitions-morph') {
      docWithVT.startViewTransition(() => {
        state.setActivePreviewPage(page);
      });
    } else {
      state.setActivePreviewPage(page);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden select-none transition-colors duration-500"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {/* Custom Magnetic Reticle Follower inside Live Showcase */}
      {state.enableCustomCursor && (
        <div
          className="pointer-events-none absolute z-50 w-9 h-9 -ml-4 -mt-4 rounded-full border flex items-center justify-center transition-transform duration-75"
          style={{
            left: cursorCoords.x,
            top: cursorCoords.y,
            borderColor: theme.accent,
            boxShadow: `0 0 20px ${theme.accent}44`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
      )}

      {/* Fixed WebGL / WebGPU 3D Layer */}
      <div className="sticky top-0 left-0 w-full h-[640px] -mb-[640px] z-0 pointer-events-auto">
        <StudioWebGLCanvas />
      </div>

      {/* Route Transition Curtain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          opacity: state.isTransitioningRoute ? 0.85 : 0,
          background:
            state.routingTransition === 'shader-dissolve'
              ? `radial-gradient(circle, ${theme.accent}, ${theme.bg})`
              : state.routingTransition === 'camera-portal'
              ? `conic-gradient(from 90deg, ${theme.accent}, ${theme.secondary}, ${theme.bg})`
              : theme.bg,
        }}
      />

      {/* Foreground Content Layer */}
      <div className="relative z-10 min-h-full flex flex-col justify-between">
        {/* Top Telemetry Ticker */}
        {state.enableStatusTicker && (
          <div
            className="w-full py-1.5 px-4 border-b text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 backdrop-blur-md"
            style={{
              borderColor: theme.border,
              backgroundColor: `${theme.bg}cc`,
              color: theme.muted,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: theme.accent }}>
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
                LIVE ENGINE // {state.canvasEngine.toUpperCase()}
              </span>
              <span>•</span>
              <span>DIM: {state.dimensionMode.toUpperCase()}</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">PHYSICS: {state.physicsMode.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>COMPRESSION: {state.compressionPreset.toUpperCase()}</span>
              <span>•</span>
              <span style={{ color: theme.text }}>
                CLIENT: {(state.userName || 'CREATOR').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Architecture Showcase */}
        <header className="px-6 pt-5 pb-3">
          <div
            className={`mx-auto flex flex-wrap items-center justify-between gap-4 transition-all ${
              state.navLayout === 'floating-pill'
                ? 'max-w-4xl px-5 py-3 rounded-full border backdrop-blur-xl shadow-2xl'
                : state.navLayout === 'brutalist-border'
                ? 'w-full p-4 border-2 uppercase tracking-wider'
                : 'w-full py-2 border-b'
            }`}
            style={{
              borderColor: state.navLayout === 'brutalist-border' ? theme.accent : theme.border,
              backgroundColor: `${theme.surface}cc`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                style={{ backgroundColor: theme.accent, color: theme.bg }}
              >
                SC
              </div>
              <div>
                <div className="font-bold tracking-tight text-sm leading-none">
                  {state.brandName || 'STUDIO CRASH'}
                </div>
                {state.websiteUrl && (
                  <div className="text-[10px] font-mono opacity-65" style={{ color: theme.muted }}>
                    {state.websiteUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Multi-Page Barba.js / View Transitions Router */}
            <nav className="flex items-center gap-1.5">
              {(['home', 'works', 'technology', 'contact'] as const).map((page) => {
                const active = state.activePreviewPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageSwitch(page)}
                    className="px-3 py-1.5 rounded-full text-xs font-mono uppercase transition-all"
                    style={{
                      backgroundColor: active ? theme.accent : 'transparent',
                      color: active ? theme.bg : theme.text,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  state.triggerPhysicsImpulse();
                  soundEngine.playInteraction('impulse', state.audioPreset, state.audioVolume);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold border flex items-center gap-1.5 transition-transform active:scale-95"
                style={{
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: `${theme.accent}15`,
                }}
                title="Trigger Rapier 3D Physics Impulse Wave"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>PULSE 3D</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Route View */}
        <main className="px-6 py-8 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
          {state.activePreviewPage === 'home' && (
            <div className="space-y-12">
              {/* HERO SECTION */}
              <section
                className={`relative pt-8 pb-12 ${
                  state.heroLayout === 'center-monolith'
                    ? 'text-center items-center flex flex-col'
                    : state.heroLayout === 'editorial-asymmetric'
                    ? 'text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-end'
                    : 'text-left space-y-6'
                }`}
              >
                <div className={state.heroLayout === 'editorial-asymmetric' ? 'lg:col-span-8 space-y-5' : 'space-y-5 max-w-4xl'}>
                  <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border backdrop-blur-md"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: `${theme.surface}bb`,
                        color: theme.accent,
                      }}
                    >
                      WELCOME {state.userName ? state.userName.toUpperCase() : 'ARCHITECT'} // {state.industry}
                    </span>

                    {state.enableRiveInteractiveBadge && (
                      <RiveInteractiveStateMachineBadge accent={theme.accent} text={theme.text} />
                    )}
                  </div>

                  {/* KINETIC TYPOGRAPHY HEADLINE */}
                  <h1
                    className={`${fontClass} text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.96] transition-all duration-300`}
                    style={{
                      color: theme.text,
                      transform:
                        state.typographyKineticMode === 'velocity-skew'
                          ? 'skewX(-6deg)'
                          : 'none',
                      textShadow:
                        state.dimensionMode !== '2d-editorial'
                          ? `0 12px 40px ${theme.bg}`
                          : 'none',
                    }}
                  >
                    {state.typographyKineticMode === 'split-char-stagger' ? (
                      <span className="inline-flex flex-wrap justify-center lg:justify-start gap-x-1">
                        {scrambleText.split('').map((ch, idx) => (
                          <span
                            key={idx}
                            className="inline-block hover:-translate-y-2 transition-transform duration-200"
                            style={{
                              color: idx % 6 === 0 ? theme.accent : theme.text,
                            }}
                          >
                            {ch === ' ' ? '\u00A0' : ch}
                          </span>
                        ))}
                      </span>
                    ) : (
                      scrambleText
                    )}
                  </h1>

                  <p
                    className="text-lg sm:text-xl font-medium tracking-wide max-w-2xl mx-auto lg:mx-0"
                    style={{ color: theme.accent }}
                  >
                    {state.brandTagline}
                  </p>

                  <p
                    className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 backdrop-blur-sm p-3 rounded-xl border"
                    style={{
                      color: theme.muted,
                      backgroundColor: `${theme.bg}99`,
                      borderColor: theme.border,
                    }}
                  >
                    {state.brandManifesto}
                  </p>

                  {/* Magnetic CTA Bar */}
                  <div className="pt-3 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                    <button
                      onClick={() => {
                        state.triggerPhysicsImpulse();
                        soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
                      }}
                      className={`px-7 py-4 rounded-full font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all duration-300 ${
                        state.enableMagneticButtons ? 'hover:scale-105 active:scale-95' : ''
                      }`}
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.bg,
                        boxShadow: `0 0 35px ${theme.accent}55`,
                      }}
                    >
                      <span>{state.ctaPrimary}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handlePageSwitch('works')}
                      className="px-6 py-4 rounded-full font-mono text-xs sm:text-sm uppercase tracking-wider border backdrop-blur-md transition-all hover:opacity-90"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: `${theme.surface}cc`,
                        color: theme.text,
                      }}
                    >
                      EXPLORE SHADER ARCHIVE
                    </button>
                  </div>
                </div>

                {state.heroLayout === 'editorial-asymmetric' && (
                  <div
                    className="lg:col-span-4 p-5 rounded-2xl border backdrop-blur-xl space-y-3"
                    style={{
                      borderColor: theme.border,
                      backgroundColor: `${theme.surface}cc`,
                    }}
                  >
                    <div className="text-xs font-mono uppercase" style={{ color: theme.accent }}>
                      ACTIVE STACK TELEMETRY
                    </div>
                    <div className="text-xs font-mono space-y-1.5" style={{ color: theme.muted }}>
                      <div>• RENDERER: {state.canvasEngine}</div>
                      <div>• SHADER: {state.shaderMaterial}</div>
                      <div>• SCROLL: {state.motionScrollPreset}</div>
                      <div>• PHYSICS: {state.physicsMode}</div>
                      <div>• ROUTER: {state.routingTransition}</div>
                    </div>
                  </div>
                )}
              </section>

              {/* KINETIC MARQUEE STRIP */}
              <div
                className="w-full py-3 px-4 rounded-xl border backdrop-blur-md overflow-hidden flex items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest"
                style={{
                  borderColor: theme.border,
                  backgroundColor: `${theme.surface}aa`,
                  color: theme.text,
                }}
              >
                <span style={{ color: theme.accent }}>★ WEBGL2 / WEBGPU TSL</span>
                <span>★ 3D GAUSSIAN SPLATTING (.SPZ)</span>
                <span className="hidden sm:inline" style={{ color: theme.secondary }}>
                  ★ RAPIER WASM RIGID PHYSICS
                </span>
                <span className="hidden md:inline">★ GSAP SCROLLTRIGGER + LENIS</span>
                <span className="hidden lg:inline" style={{ color: theme.accent }}>
                  ★ CURTAINS.JS DOM-TO-GL
                </span>
              </div>

              {/* DOM-TO-WEBGL SHADER PLANES SHOWCASE */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.accent }}>
                      DOM-TO-GL SYNCHRONIZATION // {state.mediaShaderMode.toUpperCase()}
                    </div>
                    <h2 className={`${fontClass} text-3xl font-bold mt-1`}>
                      Interactive Shader Media Planes
                    </h2>
                  </div>
                  <p className="text-xs font-mono opacity-75" style={{ color: theme.muted }}>
                    Hover cards to test UV displacement, tilt & chromatic shift
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {state.projects.map((proj, idx) => (
                    <ShaderMediaCard key={proj.id} project={proj} index={idx} />
                  ))}
                </div>
              </section>

              {/* INTERACTIVE WEBGL VIDEO REEL SLAB (Step 5: Videos & DOM-to-GL Sync) */}
              {state.enableVideoReelPlane && (
                <section
                  className="relative rounded-2xl overflow-hidden border p-6 backdrop-blur-xl transition-all"
                  style={{
                    borderColor: state.aestheticStyle === 'brutalist' ? theme.accent : theme.border,
                    borderWidth: state.aestheticStyle === 'brutalist' ? '2px' : '1px',
                    backgroundColor: `${theme.surface}dd`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${theme.accent}22 4px), radial-gradient(circle at ${cursorCoords.x}px ${cursorCoords.y}px, ${theme.secondary}44, transparent 60%)`,
                    }}
                  />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-black/40" style={{ color: theme.accent }}>
                        <Play className="w-3 h-3 fill-current" />
                        <span>THREE.VIDEOTEXTURE // SHOWREEL SLAB (60FPS HDR)</span>
                      </div>
                      <h3 className={`${fontClass} text-2xl font-bold`}>
                        {state.brandName || 'STUDIO CRASH'} — 2026 Spatial Showreel
                      </h3>
                      <p className="text-xs max-w-xl" style={{ color: theme.muted }}>
                        Synchronized DOM-to-WebGL video plane with real-time scanline shader, KTX2/Basis transcode stream, and pointer-reactive timecode scrub.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        state.triggerPhysicsImpulse();
                        soundEngine.playInteraction('impulse', state.audioPreset, state.audioVolume);
                      }}
                      className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase flex items-center gap-2 shrink-0 transition-transform active:scale-95"
                      style={{ backgroundColor: theme.accent, color: theme.bg }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>SCRUB REEL + IMPULSE</span>
                    </button>
                  </div>
                </section>
              )}

              {/* VIDEO REEL SLAB & BENTO ARCHITECTURE SPECS */}
              {state.showBentoSpecs && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div
                    className="p-5 rounded-2xl border backdrop-blur-md space-y-2"
                    style={{ borderColor: theme.border, backgroundColor: `${theme.surface}cc` }}
                  >
                    <div className="flex items-center justify-between">
                      <Cpu className="w-5 h-5" style={{ color: theme.accent }} />
                      <span className="text-[11px] font-mono opacity-60">01 // GPU PIPELINE</span>
                    </div>
                    <h4 className="font-bold text-base">TSL & Postprocessing</h4>
                    <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                      Active Material: <strong style={{ color: theme.text }}>{state.shaderMaterial}</strong>.
                      Bloom ({state.postBloom ? 'ON' : 'OFF'}), Chromatic Aberration ({state.postChromatic ? 'ON' : 'OFF'}),
                      Film Grain ({state.postNoiseGrain ? 'ON' : 'OFF'}).
                    </p>
                  </div>

                  <div
                    className="p-5 rounded-2xl border backdrop-blur-md space-y-2"
                    style={{ borderColor: theme.border, backgroundColor: `${theme.surface}cc` }}
                  >
                    <div className="flex items-center justify-between">
                      <Move3d className="w-5 h-5" style={{ color: theme.secondary }} />
                      <span className="text-[11px] font-mono opacity-60">02 // CHOREOGRAPHY</span>
                    </div>
                    <h4 className="font-bold text-base">Theatre.js & Rapier</h4>
                    <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                      Camera Path: <strong style={{ color: theme.text }}>{state.theatreCameraPath}</strong>.
                      Scroll Engine: <strong style={{ color: theme.text }}>{state.motionScrollPreset}</strong> with
                      real-time pointer attractor physics.
                    </p>
                  </div>

                  <div
                    className="p-5 rounded-2xl border backdrop-blur-md space-y-2"
                    style={{ borderColor: theme.border, backgroundColor: `${theme.surface}cc` }}
                  >
                    <div className="flex items-center justify-between">
                      <Radio className="w-5 h-5" style={{ color: theme.accent }} />
                      <span className="text-[11px] font-mono opacity-60">03 // SENSORY & ASSET</span>
                    </div>
                    <h4 className="font-bold text-base">Web Audio & Draco/KTX2</h4>
                    <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                      Synth Preset: <strong style={{ color: theme.text }}>{state.audioPreset}</strong>.
                      Asset Pipeline: <strong style={{ color: theme.text }}>{state.compressionPreset}</strong> with
                      View Transitions API routing.
                    </p>
                  </div>
                </section>
              )}
            </div>
          )}

          {state.activePreviewPage === 'works' && (
            <div className="space-y-6 py-8">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.border }}>
                <div>
                  <span className="text-xs font-mono uppercase" style={{ color: theme.accent }}>
                    BARBA.JS / VIEW TRANSITION ROUTE // WORKS
                  </span>
                  <h2 className={`${fontClass} text-4xl font-bold mt-1`}>
                    {state.brandName} — Curated Spatial Works
                  </h2>
                </div>
                <button
                  onClick={() => handlePageSwitch('home')}
                  className="px-4 py-2 rounded-full text-xs font-mono border"
                  style={{ borderColor: theme.border }}
                >
                  ← RETURN HOME
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.projects.map((proj, idx) => (
                  <ShaderMediaCard key={proj.id} project={proj} index={idx} />
                ))}
              </div>
            </div>
          )}

          {state.activePreviewPage === 'technology' && (
            <div className="space-y-6 py-8">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.border }}>
                <div>
                  <span className="text-xs font-mono uppercase" style={{ color: theme.accent }}>
                    FULL TECHNICAL SPECIFICATION // 2026 MASTER STACK
                  </span>
                  <h2 className={`${fontClass} text-4xl font-bold mt-1`}>
                    Active Architecture Matrix
                  </h2>
                </div>
                <button
                  onClick={() => handlePageSwitch('home')}
                  className="px-4 py-2 rounded-full text-xs font-mono border"
                  style={{ borderColor: theme.border }}
                >
                  ← RETURN HOME
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {[
                  { label: 'Canvas Engine', val: state.canvasEngine, desc: 'WebGL2 / WebGPU / Splatting' },
                  { label: '3D Primitive', val: state.geometryPrimitive, desc: 'Procedural Parametric Mesh' },
                  { label: 'Shader Material', val: state.shaderMaterial, desc: 'TSL / Transmission / Chrome' },
                  { label: 'DOM-to-GL Sync', val: state.mediaShaderMode, desc: 'Curtains.js / Scroll-Rig UV' },
                  { label: 'Motion & Scroll', val: state.motionScrollPreset, desc: 'GSAP ScrollTrigger + Lenis' },
                  { label: 'Physics World', val: state.physicsMode, desc: 'Rapier 3D Rigid-Body Sim' },
                  { label: 'Camera Rig', val: state.theatreCameraPath, desc: 'Theatre.js Keyframe Spline' },
                  { label: 'Kinetic Type', val: state.typographyKineticMode, desc: 'SplitType + Troika MSDF' },
                  { label: 'Audio Synth', val: state.audioPreset, desc: 'Procedural Web Audio API' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl border backdrop-blur-md"
                    style={{ borderColor: theme.border, backgroundColor: `${theme.surface}cc` }}
                  >
                    <div className="opacity-60 uppercase">{item.label}</div>
                    <div className="text-base font-bold mt-1" style={{ color: theme.accent }}>
                      {item.val}
                    </div>
                    <div className="mt-1 opacity-75">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state.activePreviewPage === 'contact' && (
            <div
              className="max-w-2xl mx-auto w-full p-8 rounded-3xl border backdrop-blur-xl space-y-6 my-8"
              style={{ borderColor: theme.border, backgroundColor: `${theme.surface}dd` }}
            >
              <div className="text-xs font-mono uppercase" style={{ color: theme.accent }}>
                DIRECT TRANSMISSION // {state.websiteUrl || 'STUDIOCRASH.DESIGN'}
              </div>
              <h2 className={`${fontClass} text-4xl font-bold`}>
                Initiate a Project with {state.brandName}
              </h2>
              <p className="text-sm opacity-80" style={{ color: theme.muted }}>
                Configured by {state.userName || 'Lead Architect'} for {state.industry}. Ready for deployment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="YOUR NAME / STUDIO"
                  className="px-4 py-3 rounded-xl border bg-transparent text-xs font-mono focus:outline-none"
                  style={{ borderColor: theme.border, color: theme.text }}
                />
                <input
                  type="email"
                  placeholder="TRANSMISSION@EMAIL.COM"
                  className="px-4 py-3 rounded-xl border bg-transparent text-xs font-mono focus:outline-none"
                  style={{ borderColor: theme.border, color: theme.text }}
                />
              </div>
              <button
                onClick={() => soundEngine.playInteraction('select', state.audioPreset, state.audioVolume)}
                className="w-full py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: theme.accent, color: theme.bg }}
              >
                {state.ctaPrimary}
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-4 border-t text-[11px] font-mono flex flex-wrap items-center justify-between gap-4 backdrop-blur-md"
          style={{
            borderColor: theme.border,
            backgroundColor: `${theme.bg}cc`,
            color: theme.muted,
          }}
        >
          <div>
            © {new Date().getFullYear()} {state.brandName || 'STUDIO CRASH'} • ARCHITECTED BY{' '}
            {state.userName || 'CREATIVE DIRECTOR'}
          </div>
          <div className="flex items-center gap-4">
            <span>THEME: {COLOR_THEMES[state.colorTheme].name.toUpperCase()}</span>
            <span>•</span>
            <span style={{ color: theme.accent }}>STUDIO CRASH ENGINE v2.6</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
