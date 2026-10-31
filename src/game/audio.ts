/**
 * Web Audio Procedural Sound Synthesizer & BGM Engine
 * Generates arcade-quality sounds without external audio asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private currentNoteIndex: number = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.titleBgmAudio) {
        try { this.titleBgmAudio.pause(); } catch {}
      }
      if (this.stageBgmAudio) {
        try { this.stageBgmAudio.pause(); } catch {}
      }
    } else {
      if (this.bgmPlaying) {
        if (this.currentBgmType === 'title' && this.titleBgmAudio) {
          this.titleBgmAudio.play().catch(() => {});
        } else if (this.currentBgmType === 'stage' && this.stageBgmAudio) {
          this.stageBgmAudio.play().catch(() => {});
        } else if (this.currentBgmType === 'stage') {
          this.startBGM();
        }
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- Sound Effects ---

  public playPunch(type: 1 | 2 | 3 = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = type === 1 ? 160 : type === 2 ? 190 : 240;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);

    // Add noise crunch for punch impact
    this.playNoiseCrack(0.08, 0.2);
  }

  public playRubberStretch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Rubber stretch glide
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.3);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  public playHeavySmash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low bass boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.35);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);

    // Heavy noise slam
    this.playNoiseCrack(0.3, 0.35);
  }

  public playAlvidaMaceSlam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Metallic resonant bell
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(80, t + 0.25);
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.3);

    // Deep deck vibration
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(90, t);
    osc2.frequency.exponentialRampToValueAtTime(20, t + 0.4);
    gain2.gain.setValueAtTime(0.6, t);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.42);

    this.playNoiseCrack(0.25, 0.4);
  }

  public playBarrelSmash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);

    this.playNoiseCrack(0.18, 0.3);
  }

  public playMeatPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [330, 440, 554, 659];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  }

  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(360, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playGatlingBurst() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Fast series of rapid punch clicks
    for (let i = 0; i < 6; i++) {
      window.setTimeout(() => {
        this.playPunch((i % 3 + 1) as 1 | 2 | 3);
      }, i * 45);
    }
  }

  public playHitImpact(isHeavy: boolean = false) {
    if (this.isMuted) return;
    if (isHeavy) {
      this.playHeavySmash();
    } else {
      this.playPunch(2);
    }
  }

  public playGameOver() {
    this.playDefeat();
  }

  public playPowerup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const melody = [
      { f: 392, d: 0.15 }, // G4
      { f: 523, d: 0.15 }, // C5
      { f: 659, d: 0.15 }, // E5
      { f: 784, d: 0.35 }, // G5
      { f: 659, d: 0.15 }, // E5
      { f: 784, d: 0.5 },  // G5 high hold
    ];

    let offset = 0;
    melody.forEach((note) => {
      const noteTime = t + offset;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + note.d + 0.05);

      offset += note.d * 0.85;
    });
  }

  public playDefeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 415, 392, 349];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.2;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.26);
    });
  }

  private playNoiseCrack(duration: number, volume: number) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // --- Official One Piece GBA Soundtracks ---
  private currentBgmType: 'none' | 'title' | 'stage' = 'none';
  private titleBgmAudio: HTMLAudioElement | null = null;
  private stageBgmAudio: HTMLAudioElement | null = null;
  private readonly titleBgmUrl: string = '/assets/aistudio/One_Piece_GBA_Soundtrack_-_Intro_Opening_5399f28c.mp3';
  private readonly stageBgmUrl: string = '/assets/aistudio/One_Piece_GBA_Soundtrack_-_Navy_Base_stage_1_89f7b6cb.mp3';

  public playTitleBGM() {
    if (this.currentBgmType === 'title' && this.bgmPlaying) return;
    this.stopBGM();
    this.currentBgmType = 'title';
    this.bgmPlaying = true;
    this.initCtx();

    if (!this.titleBgmAudio && typeof Audio !== 'undefined') {
      try {
        this.titleBgmAudio = new Audio(this.titleBgmUrl);
        this.titleBgmAudio.loop = true;
        this.titleBgmAudio.volume = 0.55;
      } catch {
        this.titleBgmAudio = null;
      }
    }

    if (this.titleBgmAudio && !this.isMuted) {
      this.titleBgmAudio.currentTime = 0;
      this.titleBgmAudio.play().catch(() => {
        this.setupUnlockListener(() => this.playTitleBGM());
      });
    }
  }

  public playStageBGM() {
    if (this.currentBgmType === 'stage' && this.bgmPlaying) return;
    this.stopBGM();
    this.currentBgmType = 'stage';
    this.bgmPlaying = true;
    this.initCtx();

    if (!this.stageBgmAudio && typeof Audio !== 'undefined') {
      try {
        this.stageBgmAudio = new Audio(this.stageBgmUrl);
        this.stageBgmAudio.loop = true;
        this.stageBgmAudio.volume = 0.55;
      } catch {
        this.stageBgmAudio = null;
      }
    }

    if (this.stageBgmAudio && !this.isMuted) {
      this.stageBgmAudio.currentTime = 0;
      this.stageBgmAudio.play().catch(() => {
        this.setupUnlockListener(() => this.playStageBGM());
      });
    } else if (!this.stageBgmAudio && !this.isMuted) {
      this.loopBGM();
    }
  }

  // Backwards compatible method
  public startBGM() {
    this.playStageBGM();
  }

  public stopBGM() {
    this.bgmPlaying = false;
    this.currentBgmType = 'none';
    if (this.titleBgmAudio) {
      try {
        this.titleBgmAudio.pause();
      } catch {
        // ignore
      }
    }
    if (this.stageBgmAudio) {
      try {
        this.stageBgmAudio.pause();
      } catch {
        // ignore
      }
    }
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private setupUnlockListener(onUnlock: () => void) {
    const unlock = () => {
      onUnlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  public playDash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
    this.playNoiseCrack(0.06, 0.12);
  }

  public playBarrelRoll() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.linearRampToValueAtTime(130, t + 0.18);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  public playAirSlash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // High swoosh slicing frequency sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.22);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.22);
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);

    this.playNoiseCrack(0.12, 0.25);
  }

  public playComboFlourish() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Triumphant ascending arpeggio chime (Arcade combo breakthrough)
    const notes = [440, 554.37, 659.25, 880, 1108.7];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.045;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });

    // Sub-bass impact swell
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.4);
    subGain.gain.setValueAtTime(0.35, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.42);
  }

  public playFinisherReady() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // High energy electric sparkle
    const notes = [587.33, 880, 1174.66, 1760];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.22);
    });
  }

  public playBazookaBlast() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // 1. Double rubber stretch tension whip
    const rubberOsc = this.ctx.createOscillator();
    const rubberGain = this.ctx.createGain();
    rubberOsc.type = 'sawtooth';
    rubberOsc.frequency.setValueAtTime(180, t);
    rubberOsc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
    rubberOsc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
    rubberGain.gain.setValueAtTime(0.4, t);
    rubberGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    rubberOsc.connect(rubberGain);
    rubberGain.connect(this.ctx.destination);
    rubberOsc.start(t);
    rubberOsc.stop(t + 0.42);

    // 2. Heavy dual-palm shockwave boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(150, t + 0.1);
    boomOsc.frequency.exponentialRampToValueAtTime(25, t + 0.55);
    boomGain.gain.setValueAtTime(0.65, t + 0.1);
    boomGain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(t + 0.1);
    boomOsc.stop(t + 0.62);

    // Crackle noise blast
    this.playNoiseCrack(0.35, 0.45);
  }

  public playSantoryuWhirlwind() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // 3 rapid cascading steel katana blade slices
    [0, 0.08, 0.16].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, t + offset);
      osc.frequency.exponentialRampToValueAtTime(220, t + offset + 0.25);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, t + offset);

      gain.gain.setValueAtTime(0.3, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.3);
    });

    // Massive whirlwind roar
    this.playNoiseCrack(0.38, 0.42);
  }

  public playCrateSmash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.2);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
    this.playNoiseCrack(0.2, 0.35);
  }

  private loopBGM() {
    if (!this.bgmPlaying || this.isMuted || !this.ctx) return;

    // Upbeat energetic East Blue Sea theme (C Major / A Minor lively cadence)
    // Notes in Hz: C4(261.6), D4(293.7), E4(329.6), F4(349.2), G4(392), A4(440), B4(493.9), C5(523.3)
    const melody = [
      // Bar 1 - We Are inspired intro motif
      { f: 523.25, d: 0.16 }, // C5
      { f: 523.25, d: 0.16 },
      { f: 587.33, d: 0.16 }, // D5
      { f: 659.25, d: 0.32 }, // E5
      { f: 523.25, d: 0.16 },
      { f: 392.00, d: 0.32 }, // G4
      // Bar 2
      { f: 440.00, d: 0.16 }, // A4
      { f: 523.25, d: 0.16 }, // C5
      { f: 493.88, d: 0.16 }, // B4
      { f: 392.00, d: 0.32 }, // G4
      { f: 440.00, d: 0.32 }, // A4
      // Bar 3
      { f: 523.25, d: 0.16 }, // C5
      { f: 587.33, d: 0.16 }, // D5
      { f: 659.25, d: 0.24 }, // E5
      { f: 783.99, d: 0.24 }, // G5
      { f: 659.25, d: 0.16 }, // E5
      { f: 587.33, d: 0.32 }, // D5
      // Bar 4
      { f: 523.25, d: 0.32 }, // C5
      { f: 440.00, d: 0.16 }, // A4
      { f: 523.25, d: 0.48 }, // C5 hold
    ];

    const bass = [
      130.81, 130.81, 164.81, 130.81, // C3
      174.61, 174.61, 196.00, 174.61, // F3
      146.83, 146.83, 196.00, 146.83, // D3
      130.81, 196.00, 130.81, 261.63  // C3 / G3
    ];

    const t = this.ctx.currentTime;
    let step = 0;

    melody.forEach((note, i) => {
      const noteStart = t + step;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, noteStart);

      gain.gain.setValueAtTime(0.08, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.d * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteStart);
      osc.stop(noteStart + note.d);

      if (i % 2 === 0) {
        const bassOsc = this.ctx!.createOscillator();
        const bassGain = this.ctx!.createGain();
        const bassFreq = bass[(i / 2) % bass.length];

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, noteStart);

        bassGain.gain.setValueAtTime(0.05, noteStart);
        bassGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx!.destination);

        bassOsc.start(noteStart);
        bassOsc.stop(noteStart + 0.3);
      }

      step += note.d;
    });

    const loopDurationMs = Math.max(1000, step * 1000);
    this.bgmTimeoutId = window.setTimeout(() => {
      if (this.bgmPlaying && !this.stageBgmAudio) {
        this.loopBGM();
      }
    }, loopDurationMs);
  }
}

export const sound = new SoundEngine();
