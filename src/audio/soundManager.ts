// Web Audio API Sound Effects Manager for toddler-friendly audio cues (Zero voice/speech synthesis)
// Operates 100% offline with zero external audio assets required

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private soundEffectsEnabled = true;

  constructor() {
    // Cancel any active or pending browser speech immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    // Load persisted preferences if available
    try {
      const savedSfx = localStorage.getItem('app_sfx_enabled');
      if (savedSfx !== null) this.soundEffectsEnabled = savedSfx === 'true';
    } catch {
      // localStorage may be unavailable in some sandboxes
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getSettings() {
    return {
      soundEffects: this.soundEffectsEnabled,
      voiceNarration: false,
    };
  }

  public setSoundEffects(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
    try {
      localStorage.setItem('app_sfx_enabled', String(enabled));
    } catch {}
  }

  public setVoiceNarration(_enabled: boolean) {
    // Voice narration / TTS is permanently disabled in the project
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  // Cute bubble pop for touch and drags
  public playPop(frequency = 520) {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.6, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Playful mascot giggle
  public playGiggle() {
    if (!this.soundEffectsEnabled) return;
    const notes = [440, 587, 659, 880];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playPop(freq);
      }, index * 60);
    });
  }

  // Eating / yum munch sound
  public playYum() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.08, 0.16].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const startFreq = 260 + i * 40;
        osc.frequency.setValueAtTime(startFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + delay + 0.06);

        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      });
    } catch {}
  }

  // Happy success chord / chime
  public playSuccessChime() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // C5, E5, G5, C6 (Do, Mi, Sol, Do alto)
      const frequencies = [523.25, 659.25, 783.99, 1046.5];

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        const startTime = now + index * 0.07;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {}
  }

  // Gentle, friendly boing for wrong attempt (no harsh buzzers!)
  public playSoftBoing() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Smooth bend down and slightly up, friendly cartoon wobble
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  // Big celebration fanfare for finishing an activity
  public playFanfare() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [
        { freq: 523.25, dur: 0.12, time: 0 },
        { freq: 659.25, dur: 0.12, time: 0.12 },
        { freq: 783.99, dur: 0.14, time: 0.24 },
        { freq: 1046.5, dur: 0.35, time: 0.4 },
      ];

      melody.forEach(({ freq, dur, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.01, now + time);
        gain.gain.linearRampToValueAtTime(0.3, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch {}
  }

  // Voice/speech synthesis is permanently disabled in Mundo da Nunu
  public speak(_text?: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const soundManager = new SoundManager();
