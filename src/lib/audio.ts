export type AudioSettings = {
  soundOn: boolean;
  volume: number;
  voiceURI: string | null;
};

export type SfxName = 'click' | 'pop' | 'correct' | 'star' | 'error' | 'win';

let settings: AudioSettings = { soundOn: true, volume: 0.9, voiceURI: null };
let audioContext: AudioContext | null = null;
let primed = false;
let speakTimer: number | null = null;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return window.speechSynthesis;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

export function configureAudio(next: AudioSettings): void {
  settings = { ...next, volume: Math.min(1, Math.max(0, next.volume)) };
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();
  if (!synth) return [];
  return synth.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('en'));
}

function chooseVoice(): SpeechSynthesisVoice | null {
  const voices = getEnglishVoices();
  if (voices.length === 0) return null;

  if (settings.voiceURI) {
    const exact = voices.find((voice) => voice.voiceURI === settings.voiceURI);
    if (exact) return exact;
  }

  return (
    voices.find((voice) => /samantha|google us english|microsoft (aria|jenny|zira)/i.test(voice.name)) ??
    voices.find((voice) => voice.lang === 'en-US') ??
    voices[0]
  );
}

/** Speaks a short English sentence. Silently does nothing where speech is unavailable. */
export function speak(
  text: string,
  options: { rate?: number; pitch?: number; volume?: number; interrupt?: boolean } = {},
): void {
  if (!settings.soundOn) return;
  const synth = getSynth();
  if (!synth) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate ?? 0.86;
    utterance.pitch = options.pitch ?? 1.06;
    utterance.volume = Math.min(1, Math.max(0, (options.volume ?? 1) * settings.volume));

    const voice = chooseVoice();
    if (voice) utterance.voice = voice;

    if (options.interrupt === false) {
      if (speakTimer !== null) {
        window.clearTimeout(speakTimer);
        speakTimer = null;
      }
      synth.resume();
      synth.speak(utterance);
      return;
    }

    synth.cancel();
    synth.resume();

    if (speakTimer !== null) window.clearTimeout(speakTimer);
    // Chrome sometimes swallows the utterance right after cancel(); a tiny
    // delay makes repeated prompts reliable on Android.
    speakTimer = window.setTimeout(() => {
      speakTimer = null;
      synth.speak(utterance);
    }, 30);
  } catch {
    // Speech is a bonus, never a blocker.
  }
}

export function stopSpeaking(): void {
  getSynth()?.cancel();
}

/** Must be called from a user gesture on iOS so audio can start later. */
export function primeAudio(): void {
  try {
    const context = getAudioContext();
    if (context && context.state === 'suspended') void context.resume();
  } catch {
    // Ignore: audio will be primed again on the next tap.
  }

  if (primed) return;
  primed = true;

  try {
    const synth = getSynth();
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(' ');
    utterance.volume = 0;
    utterance.rate = 2;
    synth.speak(utterance);
  } catch {
    // Ignore.
  }
}

function tone(
  context: AudioContext,
  frequency: number,
  at: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.16,
  slideTo?: number,
): void {
  const start = context.currentTime + at;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);

  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * settings.volume), start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

export function playSfx(name: SfxName): void {
  if (!settings.soundOn) return;
  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state === 'suspended') void context.resume();
  } catch {
    return;
  }

  switch (name) {
    case 'click':
      tone(context, 520, 0, 0.06, 'sine', 0.1);
      break;
    case 'pop':
      tone(context, 420, 0, 0.1, 'sine', 0.16, 760);
      break;
    case 'correct':
      tone(context, 659.25, 0, 0.14, 'triangle', 0.15);
      tone(context, 783.99, 0.08, 0.14, 'triangle', 0.15);
      tone(context, 1046.5, 0.16, 0.22, 'triangle', 0.15);
      break;
    case 'star':
      tone(context, 1046.5, 0, 0.12, 'sine', 0.13);
      tone(context, 1318.5, 0.07, 0.12, 'sine', 0.13);
      tone(context, 1568, 0.14, 0.22, 'sine', 0.13);
      break;
    case 'error':
      tone(context, 233.08, 0, 0.16, 'sine', 0.09);
      tone(context, 196, 0.12, 0.2, 'sine', 0.08);
      break;
    case 'win':
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        tone(context, frequency, index * 0.11, 0.26, 'triangle', 0.14);
      });
      break;
    default:
      break;
  }
}

export function buzz(duration = 15): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Not supported everywhere.
    }
  }
}
