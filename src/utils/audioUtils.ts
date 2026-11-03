/**
 * Audio processing utilities for Gemini Live API (gemini-3.8-live)
 * Input: 16kHz PCM 16-bit mono
 * Output: 24kHz PCM 16-bit mono or WAV audio playback
 */

// Convert Float32Array to 16-bit PCM ArrayBuffer and encode as base64
export function floatTo16BitPCMBase64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
  }
  
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Play raw 24kHz 16-bit PCM chunk using Web Audio API
export function play24kPCMChunk(
  audioCtx: AudioContext,
  base64Audio: string,
  onEnded?: () => void
): AudioBufferSourceNode {
  const arrayBuffer = base64ToArrayBuffer(base64Audio);
  const int16Array = new Int16Array(arrayBuffer);
  const float32Array = new Float32Array(int16Array.length);

  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
  audioBuffer.getChannelData(0).set(float32Array);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  if (onEnded) {
    source.onended = onEnded;
  }
  source.start();
  return source;
}

// Play complete WAV base64 audio with safe fallback for browser autoplay restrictions
export function playWavBase64(base64Audio: string): Promise<HTMLAudioElement | null> {
  return new Promise((resolve) => {
    try {
      if (!base64Audio || typeof base64Audio !== 'string') {
        resolve(null);
        return;
      }
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.onended = () => {
        // completed playback
      };
      audio.onerror = () => {
        resolve(null);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            resolve(audio);
          })
          .catch((err) => {
            console.warn('Audio playback notice (browser autoplay policy or decode):', err?.message || err);
            resolve(null);
          });
      } else {
        resolve(audio);
      }
    } catch (err) {
      resolve(null);
    }
  });
}

/**
 * GaplessPCMPlayer: Schedules 24kHz PCM chunks back-to-back using Web Audio API
 * Avoids audio clicks, pauses, and overlaps during Gemini Live API streaming
 */
export class GaplessPCMPlayer {
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private nextStartTime: number = 0;
  private activeNodes: AudioBufferSourceNode[] = [];
  public isPlaying: boolean = false;
  private sessionId: number = 0;

  constructor(sampleRate: number = 24000) {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass({ sampleRate });
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);
      }
    }
  }

  async resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  enqueueChunk(base64Audio: string, onPlayStateChange?: (playing: boolean) => void) {
    if (!this.audioCtx || this.audioCtx.state === 'closed' || !this.gainNode) return;

    const currentSession = this.sessionId;

    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      // If session changed while decoding, drop chunk
      if (this.sessionId !== currentSession) return;

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.activeNodes.push(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        onPlayStateChange?.(true);
      }

      source.onended = () => {
        const index = this.activeNodes.indexOf(source);
        if (index > -1) {
          this.activeNodes.splice(index, 1);
        }
        if (this.activeNodes.length === 0) {
          this.isPlaying = false;
          onPlayStateChange?.(false);
        }
      };
    } catch (err) {
      console.warn('Gapless playback chunk error:', err);
    }
  }

  // Instant mute and clear all queued/active buffers (critical for barge-in and overlap prevention)
  stop() {
    this.sessionId++; // Invalidate pending chunks
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    } else {
      this.nextStartTime = 0;
    }
    this.isPlaying = false;
  }

  close() {
    this.stop();
    if (this.gainNode) {
      try { this.gainNode.disconnect(); } catch (e) {}
      this.gainNode = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
    this.audioCtx = null;
  }
}

