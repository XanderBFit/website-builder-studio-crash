import React from 'react';
import { useStudioStore, COLOR_THEMES } from './store/useStudioStore';
import { MinimalStepQuestionWizard } from './components/MinimalStepQuestionWizard';
import { LiveBrandShowcase } from './components/LiveBrandShowcase';
import { StudioWebGLCanvas } from './components/StudioWebGLCanvas';
import { soundEngine } from './utils/soundEngine';
import {
  Columns,
  Maximize2,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';

export function App() {
  const state = useStudioStore();
  const theme = COLOR_THEMES[state.colorTheme];

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#060608] text-[#F4F4F0]">
      {/* Studio Crash Top Control Bar */}
      <div className="h-12 px-4 border-b border-white/10 bg-[#050507] flex items-center justify-between gap-4 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              state.setStep(0);
              soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shadow transition-transform hover:scale-105"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            SC
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-white">
              STUDIO CRASH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#CCFF00]">
              v2.6
            </span>
          </div>
          <span className="hidden lg:inline text-xs font-mono text-white/45">
            // {state.currentStep === 0 ? 'LANDING' : `QUESTION ${state.currentStep} OF 11`}
          </span>
        </div>

        {/* Workspace Layout Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              state.setStudioMode('wizard');
              soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
            }}
            className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
              state.studioMode === 'wizard'
                ? 'bg-[#CCFF00] text-black font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>FOCUSED QUESTIONS</span>
          </button>

          <button
            onClick={() => {
              state.setStudioMode('split-studio');
              soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
            }}
            className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
              state.studioMode === 'split-studio'
                ? 'bg-[#CCFF00] text-black font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SPLIT LIVE STAGE</span>
          </button>

          <button
            onClick={() => {
              state.setStudioMode('full-site');
              soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
            }}
            className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
              state.studioMode === 'full-site'
                ? 'bg-[#CCFF00] text-black font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FULLSCREEN SITE</span>
          </button>
        </div>

        {/* Quick Audio & Reset Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextPreset = state.audioPreset === 'muted' ? 'harmonic-ambient' : 'muted';
              state.updateConfig('audioPreset', nextPreset);
              if (nextPreset !== 'muted') {
                soundEngine.playInteraction('select', nextPreset, state.audioVolume);
              }
            }}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 text-xs font-mono flex items-center gap-1.5"
            title="Toggle Web Audio Synthesizer"
          >
            {state.audioPreset === 'muted' ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/50" />
                <span className="hidden md:inline text-white/50">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="hidden md:inline text-[#CCFF00]">AUDIO ON</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              state.setStep(0);
              state.applyQuickPreset('award-agency');
              soundEngine.playInteraction('select', state.audioPreset, state.audioVolume);
            }}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white"
            title="Reset to Beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* MODE 1: FOCUSED QUESTION WIZARD (Background 3D Canvas shines through subtle transparency) */}
        {state.studioMode === 'wizard' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Live Interactive 3D WebGL Canvas Layer in background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <StudioWebGLCanvas />
            </div>
            <div className="relative z-10 w-full max-w-4xl h-full backdrop-blur-xl bg-[#060608]/75 border-x border-white/10 shadow-2xl flex flex-col">
              <MinimalStepQuestionWizard />
            </div>
          </div>
        )}

        {/* MODE 2: SPLIT STUDIO (Question on left, Live Brand Showcase on right) */}
        {state.studioMode === 'split-studio' && (
          <>
            <div className="w-full lg:w-[500px] xl:w-[560px] h-full shrink-0 z-20 border-r border-white/10 bg-[#07070b]">
              <MinimalStepQuestionWizard />
            </div>
            <div className="hidden lg:block flex-1 h-full relative z-10">
              <LiveBrandShowcase />
            </div>
          </>
        )}

        {/* MODE 3: FULLSCREEN SITE (Live interactive site result) */}
        {state.studioMode === 'full-site' && (
          <div className="w-full h-full relative z-10">
            <LiveBrandShowcase />
            <button
              onClick={() => state.setStudioMode('wizard')}
              className="fixed bottom-6 left-6 z-50 px-5 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-white/20 backdrop-blur-xl transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: theme.accent, color: theme.bg }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>EDIT SITE DESIGN</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
