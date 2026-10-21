import React, { useState } from 'react';
import {
  useStudioStore,
  COLOR_THEMES,
  MAX_QUESTIONS,
  type ColorThemeId,
  type AestheticStyle,
  type RenderDimension,
  type CanvasEngine,
  type GeometryPrimitive,
  type MediaShaderMode,
  type MotionScrollPreset,
  type PhysicsMode,
  type AudioSynthPreset,
  type RoutingTransitionMode,
} from '../store/useStudioStore';
import { soundEngine } from '../utils/soundEngine';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Check,
  Eye,
  Copy,
  CheckCircle2,
  Volume2,
  Play,
  RotateCcw,
} from 'lucide-react';

export const MinimalStepQuestionWizard: React.FC = () => {
  const state = useStudioStore();
  const theme = COLOR_THEMES[state.colorTheme];
  const [copiedCode, setCopiedCode] = useState(false);

  // Custom text answer state
  const [customInput, setCustomInput] = useState('');

  const playClick = () => {
    soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
  };

  const playHover = () => {
    soundEngine.playInteraction('hover', state.audioPreset, state.audioVolume);
  };

  const copyBlueprint = () => {
    const code = `// STUDIO CRASH MASTER ENGINE BLUEPRINT
export const STUDIO_CONFIG = {
  brand: {
    name: ${JSON.stringify(state.brandName)},
    tagline: ${JSON.stringify(state.brandTagline)},
    website: ${JSON.stringify(state.websiteUrl)},
    aesthetic: '${state.aestheticStyle}',
    colorTheme: '${state.colorTheme}',
  },
  spatial: {
    dimension: '${state.dimensionMode}',
    canvasEngine: '${state.canvasEngine}',
    primitive: '${state.geometryPrimitive}',
    shaderMaterial: '${state.shaderMaterial}',
    bloom: ${state.postBloom},
  },
  motion: {
    scrollEngine: '${state.motionScrollPreset}',
    physics: '${state.physicsMode}',
    mediaShader: '${state.mediaShaderMode}',
  },
  sensory: {
    audio: '${state.audioPreset}',
    routing: '${state.routingTransition}',
  }
};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    playClick();
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // ----------------------------------------------------
  // STEP 0: LANDING HERO (CREATE WEBSITE)
  // ----------------------------------------------------
  if (state.currentStep === 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center select-none overflow-hidden">
        {/* Animated aura rings behind hero */}
        <div
          className="absolute -top-24 w-[480px] h-[480px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-1000 animate-pulse-slow"
          style={{ background: theme.accent }}
        />

        <div className="relative z-10 max-w-3xl space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl text-xs font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
            <span style={{ color: theme.accent }}>STUDIO CRASH // ARCHITECT v2.6</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-extrabold tracking-tight leading-[0.92] text-white">
            CREATE <br />
            <span
              className="italic font-serif font-normal tracking-normal transition-colors duration-500"
              style={{ color: theme.accent }}
            >
              WEBSITE
            </span>
          </h1>

          <p className="text-sm md:text-base text-white/60 font-mono max-w-lg mx-auto leading-relaxed">
            One question at a time. Every decision transforms the real-time 3D canvas, motion physics, and sound in live preview.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                state.nextStep();
                playClick();
              }}
              className="w-full sm:w-auto px-10 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.accent,
                color: theme.bg,
                boxShadow: `0 0 45px ${theme.accent}66`,
              }}
            >
              <span>START BUILDING</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                state.setStudioMode('split-studio');
                playClick();
              }}
              className="w-full sm:w-auto px-8 py-5 rounded-full font-mono text-xs uppercase tracking-wider border border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-white/60" />
              <span>EXPLORE LIVE STAGE</span>
            </button>
          </div>
        </div>

        {/* Floating instruction ticker */}
        <div className="absolute bottom-6 left-0 right-0 text-center font-mono text-[11px] text-white/35 uppercase tracking-widest">
          HARDWARE ACCELERATED • ZERO TEMPLATES • REAL-TIME WEBGPU
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STEP 12: FINAL BLUEPRINT & LAUNCH
  // ----------------------------------------------------
  if (state.currentStep === MAX_QUESTIONS) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center select-none overflow-y-auto">
        <div className="max-w-2xl w-full space-y-6 animate-fadeIn py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-[#CCFF00]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ARCHITECTURE COMPLETE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Your {state.brandName} Site Is Ready.
          </h2>

          <p className="text-xs sm:text-sm text-white/65 font-mono leading-relaxed">
            Every choice has been composed into an award-winning WebGL + GSAP + Rapier stack. Launch into full preview or copy the blueprint.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                state.setStudioMode('full-site');
                playClick();
              }}
              className="px-8 py-4 rounded-full font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: theme.accent, color: theme.bg }}
            >
              <Eye className="w-4 h-4" />
              <span>ENTER FULLSCREEN SITE</span>
            </button>

            <button
              onClick={copyBlueprint}
              className="px-6 py-4 rounded-full font-mono text-xs uppercase tracking-wider border border-white/15 bg-white/[0.04] hover:bg-white/10 text-white flex items-center gap-2 transition-all"
            >
              {copiedCode ? <Check className="w-4 h-4 text-[#CCFF00]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'COPIED BLUEPRINT' : 'COPY BLUEPRINT'}</span>
            </button>

            <button
              onClick={() => {
                state.setStep(0);
                playClick();
              }}
              className="p-4 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 text-white/60 hover:text-white"
              title="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SINGLE-QUESTION DATA CONFIGURATION (STEPS 1 to 11)
  // ----------------------------------------------------
  const questions: Record<
    number,
    {
      stepNumber: string;
      title: string;
      subtitle: string;
      options: {
        id: string;
        label: string;
        desc: string;
        previewBadge?: string;
        action: () => void;
      }[];
      allowCustomAnswer?: {
        placeholder: string;
        onSubmit: (val: string) => void;
      };
      isSelected: (id: string) => boolean;
    }
  > = {
    // QUESTION 1: BRAND IDENTITY
    1: {
      stepNumber: '01 / 11',
      title: 'What is your brand name or website concept?',
      subtitle: 'Pick a curated archetype or type your own brand name below.',
      options: [
        {
          id: 'STUDIO CRASH',
          label: 'STUDIO CRASH',
          desc: 'High-velocity creative technology & 3D WebGPU lab',
          previewBadge: 'DEFAULT',
          action: () => {
            state.updateConfig('brandName', 'STUDIO CRASH');
            state.updateConfig('brandTagline', 'ARCHITECTING DIGITAL GRAVITY & REAL-TIME SPATIAL EXPERIENCES');
          },
        },
        {
          id: 'AETHERIA OS',
          label: 'AETHERIA OS',
          desc: 'Spatial computing & neural radiance architecture',
          previewBadge: 'NEURAL',
          action: () => {
            state.updateConfig('brandName', 'AETHERIA OS');
            state.updateConfig('brandTagline', 'NEXT-GEN SPATIAL OPERATING SYSTEM');
          },
        },
        {
          id: 'MONOLITH // 09',
          label: 'MONOLITH // 09',
          desc: 'Swiss brutalist publication with exposed physical grids',
          previewBadge: 'BRUTALIST',
          action: () => {
            state.updateConfig('brandName', 'MONOLITH // 09');
            state.updateConfig('brandTagline', 'TACTILE DIGITAL ARCHIVE & INDUSTRIAL ESSAYS');
          },
        },
        {
          id: 'SYNTHESIS AUDIO',
          label: 'SYNTHESIS AUDIO',
          desc: 'Interactive audio software & algorithmic instruments',
          previewBadge: 'SENSORY',
          action: () => {
            state.updateConfig('brandName', 'SYNTHESIS AUDIO');
            state.updateConfig('brandTagline', 'PROCEDURAL POLYPHONIC SOUNDSCAPES FOR THE WEB');
          },
        },
      ],
      allowCustomAnswer: {
        placeholder: 'Type your brand name (e.g. VORTEX LABS)...',
        onSubmit: (val) => {
          if (!val.trim()) return;
          state.updateConfig('brandName', val.trim().toUpperCase());
          state.updateConfig('brandTagline', `${val.trim().toUpperCase()} // DIGITAL EXPERIENCE`);
        },
      },
      isSelected: (id) => state.brandName === id,
    },

    // QUESTION 2: AESTHETIC STYLE
    2: {
      stepNumber: '02 / 11',
      title: 'Which visual style direction fits your vision?',
      subtitle: 'Every option sets typography, contrast, and layout architecture immediately.',
      options: [
        {
          id: 'kinetic',
          label: 'Kinetic Avant-Garde',
          desc: 'High-speed typography, dynamic mouse warp & fluid energy',
          previewBadge: 'AWWWARDS SOTD',
          action: () => state.updateConfig('aestheticStyle', 'kinetic'),
        },
        {
          id: 'brutalist',
          label: 'Swiss Neo-Brutalist',
          desc: 'Exposed technical hairline grids, mono telemetry & raw borders',
          previewBadge: 'TACTILE',
          action: () => state.updateConfig('aestheticStyle', 'brutalist'),
        },
        {
          id: 'editorial',
          label: 'High-Fashion Editorial',
          desc: 'Instrument Serif poise, generous whitespace & luxury curation',
          previewBadge: 'ATELIER',
          action: () => state.updateConfig('aestheticStyle', 'editorial'),
        },
        {
          id: 'spatial',
          label: 'Spatial Glass OS',
          desc: 'Refractive frosted surfaces, floating HUD widgets & depth',
          previewBadge: 'VISION OS',
          action: () => state.updateConfig('aestheticStyle', 'spatial'),
        },
        {
          id: 'cyber',
          label: 'Bioluminescent Cyber',
          desc: 'Plasma glow shaders, deep dark space & electric highlights',
          previewBadge: 'WEBGPU',
          action: () => state.updateConfig('aestheticStyle', 'cyber'),
        },
        {
          id: 'minimal',
          label: 'Monolith Minimalist',
          desc: 'Sculptural restraint, silent typography & pure micro-motion',
          previewBadge: 'ARCHITECT',
          action: () => state.updateConfig('aestheticStyle', 'minimal'),
        },
      ],
      allowCustomAnswer: {
        placeholder: 'Or define your own aesthetic concept...',
        onSubmit: (val) => {
          if (!val.trim()) return;
          state.updateConfig('brandManifesto', `Custom Aesthetic: ${val.trim()}`);
        },
      },
      isSelected: (id) => state.aestheticStyle === id,
    },

    // QUESTION 3: COLOR THEMES
    3: {
      stepNumber: '03 / 11',
      title: 'What color atmosphere should your site embody?',
      subtitle: 'Click any palette to watch the entire canvas and typography shift tones.',
      options: [
        {
          id: 'obsidian-lime',
          label: 'Obsidian & Acid Lime',
          desc: 'Dark void (#060608) with high-voltage neon lime (#CCFF00)',
          previewBadge: '#CCFF00',
          action: () => state.updateConfig('colorTheme', 'obsidian-lime'),
        },
        {
          id: 'alabaster-ink',
          label: 'Alabaster & Archival Ink',
          desc: 'Warm paper (#F4F2ED) with high-fashion vermillion accent (#FF3300)',
          previewBadge: '#FF3300',
          action: () => state.updateConfig('colorTheme', 'alabaster-ink'),
        },
        {
          id: 'tokyo-cyber',
          label: 'Neo-Tokyo Neural',
          desc: 'Midnight violet (#05040D) with electric hot magenta (#FF0055)',
          previewBadge: '#FF0055',
          action: () => state.updateConfig('colorTheme', 'tokyo-cyber'),
        },
        {
          id: 'editorial-warm',
          label: 'Espresso & Gold Leaf',
          desc: 'Smoked espresso (#0E0C0A) with architectural gold (#E2B86B)',
          previewBadge: '#E2B86B',
          action: () => state.updateConfig('colorTheme', 'editorial-warm'),
        },
        {
          id: 'cobalt-matrix',
          label: 'Hyper Cobalt & Signal',
          desc: 'Deep oceanic navy (#04091A) with fluorescent cyan (#00FF88)',
          previewBadge: '#00FF88',
          action: () => state.updateConfig('colorTheme', 'cobalt-matrix'),
        },
        {
          id: 'monolith-chrome',
          label: 'Liquid Chrome Monolith',
          desc: 'Stealth carbon (#0A0B0D) with mirror chrome silver (#FFFFFF)',
          previewBadge: '#FFFFFF',
          action: () => state.updateConfig('colorTheme', 'monolith-chrome'),
        },
      ],
      isSelected: (id) => state.colorTheme === id,
    },

    // QUESTION 4: 2D OR 3D SPATIAL DIMENSION
    4: {
      stepNumber: '04 / 11',
      title: 'Do you want a 2D layout, pure 3D canvas, or Hybrid sync?',
      subtitle: 'Compare how the page behaves when 3D graphics sync directly behind DOM text.',
      options: [
        {
          id: 'hybrid-sync',
          label: 'Hybrid DOM-to-GL Sync',
          desc: 'Crisp semantic text overlaid on a reactive 3D WebGL background canvas',
          previewBadge: 'RECOMMENDED',
          action: () => state.updateConfig('dimensionMode', 'hybrid-sync'),
        },
        {
          id: '3d-webgl',
          label: 'Full 3D Spatial Stage',
          desc: 'Immersive world space with 3D floating typography and camera orbit',
          previewBadge: 'IMMERSIVE',
          action: () => state.updateConfig('dimensionMode', '3d-webgl'),
        },
        {
          id: '2d-editorial',
          label: 'Pure 2D Architectural Grid',
          desc: 'Fast, clean Swiss layout with zero 3D canvas overhead (120 FPS)',
          previewBadge: 'LIGHTWEIGHT',
          action: () => state.updateConfig('dimensionMode', '2d-editorial'),
        },
      ],
      isSelected: (id) => state.dimensionMode === id,
    },

    // QUESTION 5: CANVAS RENDERING ENGINE
    5: {
      stepNumber: '05 / 11',
      title: 'Which WebGL/GPU rendering pipeline should power the canvas?',
      subtitle: 'Select the graphics engine architecture used to render interactive visuals.',
      options: [
        {
          id: 'tsl-webgpu',
          label: 'Three.js Shading Language (TSL / WebGPU)',
          desc: 'Node-based GPU shaders compiling seamlessly to WGSL and GLSL',
          previewBadge: 'CUTTING-EDGE',
          action: () => state.updateConfig('canvasEngine', 'tsl-webgpu'),
        },
        {
          id: 'gaussian-splat',
          label: '3D Gaussian Splatting (.SPZ)',
          desc: 'Volumetric photorealistic neural radiance point cloud field',
          previewBadge: 'PHOTO-REAL',
          action: () => {
            state.updateConfig('canvasEngine', 'gaussian-splat');
            state.updateConfig('geometryPrimitive', 'gaussian-pointcloud');
          },
        },
        {
          id: 'r3f-drei',
          label: 'React Three Fiber (R3F) + Drei',
          desc: 'Declarative component-driven 3D scene graph with physical transmission',
          previewBadge: 'ECOSYSTEM',
          action: () => state.updateConfig('canvasEngine', 'r3f-drei'),
        },
        {
          id: 'spline-scene',
          label: 'Spline 3D Scene Pipeline',
          desc: 'Vector-designed interactive 3D objects with mouse tracking states',
          previewBadge: 'INTERACTIVE',
          action: () => state.updateConfig('canvasEngine', 'spline-scene'),
        },
      ],
      isSelected: (id) => state.canvasEngine === id,
    },

    // QUESTION 6: 3D HERO PRIMITIVE
    6: {
      stepNumber: '06 / 11',
      title: 'What centerpiece 3D sculpture should anchor the stage?',
      subtitle: 'Watch the central geometry morph in the live viewport behind this panel.',
      options: [
        {
          id: 'torus-knot',
          label: 'Hyper Torus Knot',
          desc: 'Complex mathematical spiral with dynamic fluid curves',
          action: () => state.updateConfig('geometryPrimitive', 'torus-knot'),
        },
        {
          id: 'icosahedron-crystal',
          label: 'Refractive Faceted Crystal',
          desc: 'Multi-faceted gemstone reflecting chromatic light beams',
          action: () => state.updateConfig('geometryPrimitive', 'icosahedron-crystal'),
        },
        {
          id: 'gaussian-pointcloud',
          label: 'Gaussian Splat Cloud',
          desc: '2,400 particle neural point cloud swarm reacting to mouse delta',
          action: () => state.updateConfig('geometryPrimitive', 'gaussian-pointcloud'),
        },
        {
          id: 'metaball-cluster',
          label: 'Organic Displacement Orb',
          desc: 'Morphing noise sphere with liquid vertex oscillation',
          action: () => state.updateConfig('geometryPrimitive', 'metaball-cluster'),
        },
        {
          id: 'cyber-monolith',
          label: 'Brutalist Monolith Slab',
          desc: 'Heavy architectural column with beveled bevel edges',
          action: () => state.updateConfig('geometryPrimitive', 'cyber-monolith'),
        },
        {
          id: 'architectural-ring',
          label: 'Orbital Halo Ring',
          desc: 'Minimalist circular ring hovering in zero-gravity space',
          action: () => state.updateConfig('geometryPrimitive', 'architectural-ring'),
        },
      ],
      isSelected: (id) => state.geometryPrimitive === id,
    },

    // QUESTION 7: SHADERS & POSTPROCESSING
    7: {
      stepNumber: '07 / 11',
      title: 'Which custom shader material should wrap the geometry?',
      subtitle: 'Changes the optical transmission, refraction, and lighting characteristics.',
      options: [
        {
          id: 'iridescent-transmission',
          label: 'Physical Glass Transmission',
          desc: 'Frosted glass with chromatic aberration and IOR light refraction',
          previewBadge: 'FROSTED GLASS',
          action: () => state.updateConfig('shaderMaterial', 'iridescent-transmission'),
        },
        {
          id: 'tsl-plasma-displace',
          label: 'TSL Vertex Plasma Displace',
          desc: 'Bioluminescent simplex noise vertex displacement shader',
          previewBadge: 'PLASMA',
          action: () => state.updateConfig('shaderMaterial', 'tsl-plasma-displace'),
        },
        {
          id: 'liquid-chrome',
          label: 'Liquid Mirror Chrome',
          desc: '100% metalness mirror surface with liquid wave ripples',
          previewBadge: 'CHROME',
          action: () => state.updateConfig('shaderMaterial', 'liquid-chrome'),
        },
        {
          id: 'wireframe-hologram',
          label: 'Holographic Neon Wireframe',
          desc: 'Additive emissive vector lines showing raw polygon topology',
          previewBadge: 'HOLOGRAM',
          action: () => state.updateConfig('shaderMaterial', 'wireframe-hologram'),
        },
      ],
      isSelected: (id) => state.shaderMaterial === id,
    },

    // QUESTION 8: IMAGES & DOM-TO-GL MEDIA
    8: {
      stepNumber: '08 / 11',
      title: 'How should project images and videos distort when hovered?',
      subtitle: 'Tested live across the project archive cards in the showcase.',
      options: [
        {
          id: 'curtains-liquid',
          label: 'Curtains.js Liquid UV Ripple',
          desc: 'Fluid water-drop ripple displacement follows your mouse position',
          previewBadge: 'FLUID',
          action: () => state.updateConfig('mediaShaderMode', 'curtains-liquid'),
        },
        {
          id: 'rgb-shift-hover',
          label: 'Velocity RGB Chromatic Split',
          desc: 'Red, green, and blue texture channels separate on fast pointer sweeps',
          previewBadge: 'GLITCH',
          action: () => state.updateConfig('mediaShaderMode', 'rgb-shift-hover'),
        },
        {
          id: 'video-reel-slab',
          label: 'WebGL Showreel Video Slab',
          desc: '60fps scanline video slab with real-time video texture sync',
          previewBadge: 'VIDEO TEXTURE',
          action: () => {
            state.updateConfig('mediaShaderMode', 'video-reel-slab');
            state.updateConfig('enableVideoReelPlane', true);
          },
        },
        {
          id: 'parallax-depth',
          label: 'r3f-scroll-rig 3D Tilt',
          desc: 'DOM card tilts smoothly on X/Y axes according to cursor distance',
          previewBadge: '3D TILT',
          action: () => state.updateConfig('mediaShaderMode', 'parallax-depth'),
        },
      ],
      isSelected: (id) => state.mediaShaderMode === id,
    },

    // QUESTION 9: MOTION & SCROLL ENGINE
    9: {
      stepNumber: '09 / 11',
      title: 'Which scroll physics and motion engine should drive the timeline?',
      subtitle: 'Configures mouse wheel inertia, section pinning, and scroll velocity.',
      options: [
        {
          id: 'lenis-butter',
          label: 'Lenis Virtual Smooth Scroll',
          desc: 'Butter-smooth linearized inertia with 0.08 lerp dampening',
          previewBadge: 'INDUSTRY STANDARD',
          action: () => state.updateConfig('motionScrollPreset', 'lenis-butter'),
        },
        {
          id: 'gsap-pin-scrub',
          label: 'GSAP ScrollTrigger Pinned Scrub',
          desc: 'Ties 3D camera rotation and typography directly to scroll progress',
          previewBadge: 'NARRATIVE',
          action: () => state.updateConfig('motionScrollPreset', 'gsap-pin-scrub'),
        },
        {
          id: 'snap-kinetic',
          label: 'Kinetic Section Snap',
          desc: 'Locks the viewport to each presentation section with elastic snap',
          previewBadge: 'PAGED',
          action: () => state.updateConfig('motionScrollPreset', 'snap-kinetic'),
        },
        {
          id: 'zero-gravity',
          label: 'Zero-Gravity Floating Scroll',
          desc: 'Weightless drifting inertia with spring-loaded scroll boundaries',
          previewBadge: 'WEIGHTLESS',
          action: () => state.updateConfig('motionScrollPreset', 'zero-gravity'),
        },
      ],
      isSelected: (id) => state.motionScrollPreset === id,
    },

    // QUESTION 10: 3D RIGID PHYSICS & IMPULSE
    10: {
      stepNumber: '10 / 11',
      title: 'What physics simulation should govern floating objects?',
      subtitle: 'Click below to test live satellite collisions or fire an impulse wave.',
      options: [
        {
          id: 'rapier-rigid',
          label: 'Rapier 3D Rigid-Body Bounce',
          desc: 'True gravity, restitution, and physical collisions via Rust WASM',
          previewBadge: 'RAPIER WASM',
          action: () => state.updateConfig('physicsMode', 'rapier-rigid'),
        },
        {
          id: 'zero-g-attractor',
          label: 'Zero-G Magnetic Pointer Attractor',
          desc: 'Objects orbit and swarm towards your cursor coordinates',
          previewBadge: 'MAGNETIC',
          action: () => state.updateConfig('physicsMode', 'zero-g-attractor'),
        },
        {
          id: 'spring-verlet',
          label: 'Verlet Elastic Spring Lattice',
          desc: 'Bouncy spring oscillations that react to velocity jolts',
          previewBadge: 'HARMONIC',
          action: () => state.updateConfig('physicsMode', 'spring-verlet'),
        },
        {
          id: 'orbital-choreography',
          label: 'Keplerian Orbital Rig',
          desc: 'Precision celestial paths orbiting the centerpiece sculpture',
          previewBadge: 'CELESTIAL',
          action: () => state.updateConfig('physicsMode', 'orbital-choreography'),
        },
      ],
      isSelected: (id) => state.physicsMode === id,
    },

    // QUESTION 11: SENSORY AUDIO & ROUTING
    11: {
      stepNumber: '11 / 11',
      title: 'What sensory sound design and page transition fits best?',
      subtitle: 'Audio micro-SFX synthesize live on your speakers via the Web Audio API.',
      options: [
        {
          id: 'harmonic-ambient',
          label: 'Harmonic Polyphonic Chords',
          desc: 'Warm polyphonic synthesizer chord sweeps on interactions',
          previewBadge: 'SYNTH CHORD',
          action: () => {
            state.updateConfig('audioPreset', 'harmonic-ambient');
            soundEngine.playInteraction('select', 'harmonic-ambient', state.audioVolume);
          },
        },
        {
          id: 'minimal-clicks',
          label: 'Tactile Mechanical Ticks',
          desc: 'Subtle high-frequency clicks like an analog camera aperture',
          previewBadge: 'CLICK',
          action: () => {
            state.updateConfig('audioPreset', 'minimal-clicks');
            soundEngine.playInteraction('select', 'minimal-clicks', state.audioVolume);
          },
        },
        {
          id: 'cyber-glitch',
          label: 'Cyber Bandpass Sweep',
          desc: 'Futuristic sawtooth filter sweep with electronic resonance',
          previewBadge: 'ELECTRONIC',
          action: () => {
            state.updateConfig('audioPreset', 'cyber-glitch');
            soundEngine.playInteraction('select', 'cyber-glitch', state.audioVolume);
          },
        },
        {
          id: 'muted',
          label: 'Silent Experience (Muted)',
          desc: 'Zero audio synthesis — completely silent navigation',
          previewBadge: 'SILENT',
          action: () => state.updateConfig('audioPreset', 'muted'),
        },
      ],
      isSelected: (id) => state.audioPreset === id,
    },
  };

  const currentQ = questions[state.currentStep];
  if (!currentQ) return null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Header / Step indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: theme.accent }}
          />
          <span className="font-mono text-xs uppercase tracking-widest font-bold text-white">
            {currentQ.stepNumber} // STUDIO ONBOARDING
          </span>
        </div>

        {/* Live Interactive Action Trigger (e.g. Physics Impulse or Audio test) */}
        <div className="flex items-center gap-2">
          {state.currentStep === 10 && (
            <button
              onClick={() => {
                state.triggerPhysicsImpulse();
                soundEngine.playInteraction('impulse', state.audioPreset, state.audioVolume);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-transform active:scale-95"
              style={{ backgroundColor: theme.accent, color: theme.bg }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>TEST 3D IMPULSE</span>
            </button>
          )}

          {state.currentStep === 11 && (
            <button
              onClick={() => soundEngine.playInteraction('select', state.audioPreset, state.audioVolume)}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold border flex items-center gap-1.5"
              style={{ borderColor: theme.accent, color: theme.accent }}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>TEST AUDIO</span>
            </button>
          )}

          <button
            onClick={() => {
              state.setStudioMode('full-site');
              playClick();
            }}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/60 hover:text-white flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VIEW SITE</span>
          </button>
        </div>
      </div>

      {/* Main Single Question Block */}
      <div className="my-auto py-6 max-w-3xl w-full mx-auto space-y-6 animate-fadeIn">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
            {currentQ.title}
          </h2>
          <p className="text-xs sm:text-sm font-mono text-white/60">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Multiple Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((opt) => {
            const selected = currentQ.isSelected(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => {
                  opt.action();
                  playClick();
                }}
                onMouseEnter={playHover}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between min-h-[96px] ${
                  selected
                    ? 'border-white bg-white/15 shadow-xl scale-[1.01]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]'
                }`}
                style={{
                  borderColor: selected ? theme.accent : undefined,
                  boxShadow: selected ? `0 0 25px ${theme.accent}33` : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {opt.label}
                  </span>
                  {selected && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.accent, color: theme.bg }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  {!selected && opt.previewBadge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                      {opt.previewBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/55 mt-2 leading-relaxed">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Optional Custom Write-In Box */}
        {currentQ.allowCustomAnswer && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-[11px] font-mono uppercase text-white/60">
              Or Type Your Own Answer:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInput.trim()) {
                    currentQ.allowCustomAnswer?.onSubmit(customInput);
                    setCustomInput('');
                    playClick();
                  }
                }}
                placeholder={currentQ.allowCustomAnswer.placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00]"
              />
              <button
                onClick={() => {
                  if (customInput.trim()) {
                    currentQ.allowCustomAnswer?.onSubmit(customInput);
                    setCustomInput('');
                    playClick();
                  }
                }}
                className="px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all"
                style={{ backgroundColor: theme.accent, color: theme.bg }}
              >
                APPLY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            state.prevStep();
            playClick();
          }}
          className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase flex items-center gap-2 text-white/80 hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        {/* Progress dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {Array.from({ length: MAX_QUESTIONS + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => state.setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                state.currentStep === i
                  ? 'w-6 bg-[#CCFF00]'
                  : state.currentStep > i
                  ? 'w-2 bg-white/50'
                  : 'w-2 bg-white/15'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            state.nextStep();
            playClick();
          }}
          className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
          style={{ backgroundColor: theme.accent, color: theme.bg }}
        >
          <span>{state.currentStep === 11 ? 'FINISH ARCHITECTURE' : 'NEXT QUESTION'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
