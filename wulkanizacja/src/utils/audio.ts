/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API sound generator for Wulkanizacja game
class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? 0.35 : 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val ? 0.35 : 0, this.ctx.currentTime);
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  // Pneumatic impact wrench: rhythmic ratcheting impacts
  public playImpactWrench(duration: number = 0.8) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const pulseCount = Math.floor(duration * 18);

    for (let i = 0; i < pulseCount; i++) {
      const pulseTime = now + (i * 0.05);

      // Low mechanical thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140 + Math.random() * 20, pulseTime);
      osc.frequency.exponentialRampToValueAtTime(40, pulseTime + 0.035);

      gain.gain.setValueAtTime(0.4, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(pulseTime);
      osc.stop(pulseTime + 0.04);
    }
  }

  // Air hiss / compressor release (puff of air)
  public playAirHiss(duration: number = 0.4) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  // Hydraulic lift humming
  public playLiftSound(duration: number = 1.2) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.linearRampToValueAtTime(80, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(60, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Wheel balancer spin and calibrated electronic beep
  public playBalancerSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Spinning motor sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(150, now + 1.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.25);

    // Beeps when finished
    setTimeout(() => {
      this.playSuccessBeep();
    }, 1100);
  }

  public playSuccessBeep() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [0, 0.1, 0.2].forEach((offset, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 2 ? 1760 : 1320, now + offset);

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });
  }

  // Cash register / coin drop "KA-CHING"
  public playCashSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Bell chime 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Bell chime 2 (higher)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.35, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.7);
  }

  // Władek comic whistle / mischief boing
  public playWladekQuip() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Soft UI click
  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Car horn honk (e.g. car arrives at parking)
  public playCarHorn() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    [400, 500].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  }
}

export const soundManager = new SoundSystem();
