"use client";

// Simple audio synthesizer to avoid asset loading issues

const createOscillator = (
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  duration: number,
  startTime: number,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playClickSound = () => {
  try {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Short "pop" sound
    // A quick exponential frequency drop often sounds like a pop/click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio error", e);
  }
};

export const playSuccessSound = () => {
  try {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Major chord arpeggio (C - E - G) + High C
    // Frequencies: C5(523.25), E5(659.25), G5(783.99), C6(1046.50)

    createOscillator(ctx, "sine", 523.25, 0.3, now);
    createOscillator(ctx, "sine", 659.25, 0.3, now + 0.1);
    createOscillator(ctx, "sine", 783.99, 0.3, now + 0.2);
    createOscillator(ctx, "sine", 1046.5, 0.6, now + 0.3); // Longer final note
  } catch (e) {
    console.error("Audio error", e);
  }
};
