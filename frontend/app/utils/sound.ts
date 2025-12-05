'use client';

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(vol, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  public playKeystroke() {
    // Mechanical keyboard click sound
    this.playTone(800 + Math.random() * 200, 'square', 0.05, 0.05);
  }

  public playSuccess() {
    // Retro success chime
    this.playTone(440, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.2), 100);
    setTimeout(() => this.playTone(1760, 'square', 0.4), 200);
  }

  public playError() {
    // Error buzz
    this.playTone(150, 'sawtooth', 0.3, 0.2);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.2), 150);
  }

  public playBoot() {
    // Startup sound
    this.playTone(110, 'sine', 2.0, 0.3);
    setTimeout(() => this.playTone(220, 'sine', 1.5, 0.2), 200);
    setTimeout(() => this.playTone(440, 'sine', 1.0, 0.1), 400);
  }
}

export const soundManager = SoundManager.getInstance();
