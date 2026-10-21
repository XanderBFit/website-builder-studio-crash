import { AudioSynthPreset } from '../store/useStudioStore';

class StudioSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playInteraction(
    type: 'hover' | 'select' | 'step' | 'transition' | 'impulse',
    preset: AudioSynthPreset,
    volume = 0.4
  ) {
    if (preset === 'muted' || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.min(volume * 0.28, 0.35), now);
    masterGain.connect(ctx.destination);

    if (preset === 'minimal-clicks') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = type === 'hover' ? 880 : type === 'select' ? 1320 : type === 'impulse' ? 180 : 660;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.045);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (preset === 'harmonic-ambient') {
      const freqs =
        type === 'hover'
          ? [528, 660]
          : type === 'select'
          ? [440, 554.37, 659.25]
          : type === 'impulse'
          ? [110, 220, 330]
          : [392, 587.33, 783.99];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 1.02, now + 0.22);

        gain.gain.setValueAtTime(0.25 / freqs.length, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.015);
        osc.stop(now + 0.26);
      });
    } else if (preset === 'cyber-glitch') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);

      const startF = type === 'hover' ? 1600 : type === 'impulse' ? 95 : 740;
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.setValueAtTime(startF * 1.4, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(startF * 0.5, now + 0.11);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  }
}

export const soundEngine = new StudioSoundEngine();
