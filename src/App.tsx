import React from 'react';
import { useStudioStore, COLOR_THEMES } from './store/useStudioStore';
import { OnboardingWizardPanel, WIZARD_STEPS } from './components/OnboardingWizardPanel';
import { LiveBrandShowcase } from './components/LiveBrandShowcase';
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
      {/* Master Studio Crash Top Control Bar */}
      <div className="h-12 px-4 border-b border-white/10 bg-[#050507] flex items-center justify-between gap-4 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shadow"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            SC
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-white">
              STUDIO CRASH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#CCFF00]">
              MASTER ENGINE v2.6
            </span>
          </div>
          <span className="hidden lg:inline text-xs font-mono text-white/45">
            // Active Step: {WIZARD_STEPS[state.currentStep]?.title}
          </span>
        </div>

        {/* Workspace Layout Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10">
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
            <span>SPLIT ARCHITECT + LIVE SHOWCASE</span>
          </button>

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
            <span className="hidden sm:inline">FOCUS WIZARD</span>
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
            <span className="hidden sm:inline">FULLSCREEN PREVIEW</span>
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
                <span className="hidden md:inline text-white/50">AUDIO MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="hidden md:inline text-[#CCFF00]">SYNTH ON</span>
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
            title="Reset to Default Studio Crash Preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split / Full Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {state.studioMode === 'split-studio' && (
          <>
            <div className="w-full lg:w-[480px] xl:w-[540px] h-full shrink-0 z-20">
              <OnboardingWizardPanel />
            </div>
            <div className="hidden lg:block flex-1 h-full relative z-10">
              <LiveBrandShowcase />
            </div>
          </>
        )}

        {state.studioMode === 'wizard' && (
          <div className="w-full max-w-4xl mx-auto h-full z-20 border-x border-white/10">
            <OnboardingWizardPanel />
          </div>
        )}

        {state.studioMode === 'full-site' && (
          <div className="w-full h-full relative z-10">
            <LiveBrandShowcase />
            <button
              onClick={() => state.setStudioMode('split-studio')}
              className="fixed bottom-5 left-5 z-50 px-4 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-white/20 backdrop-blur-xl"
              style={{ backgroundColor: theme.accent, color: theme.bg }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>OPEN ONBOARDING ARCHITECT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
