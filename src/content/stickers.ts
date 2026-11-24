export type Sticker = {
  id: string;
  emoji: string;
  name: string;
  threshold: number;
};

export const STICKERS: Sticker[] = [
  { id: 'fox', emoji: '🦊', name: 'Fox', threshold: 0 },
  { id: 'panda', emoji: '🐼', name: 'Panda', threshold: 5 },
  { id: 'frog', emoji: '🐸', name: 'Frog', threshold: 10 },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', threshold: 15 },
  { id: 'octopus', emoji: '🐙', name: 'Octopus', threshold: 20 },
  { id: 'dino', emoji: '🦖', name: 'Dino', threshold: 30 },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', threshold: 40 },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', threshold: 50 },
  { id: 'star', emoji: '🌟', name: 'Star', threshold: 65 },
  { id: 'donut', emoji: '🍩', name: 'Donut', threshold: 80 },
  { id: 'bee', emoji: '🐝', name: 'Bee', threshold: 100 },
  { id: 'whale', emoji: '🐳', name: 'Whale', threshold: 125 },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', threshold: 150 },
  { id: 'icecream', emoji: '🍦', name: 'Ice cream', threshold: 180 },
  { id: 'balloon', emoji: '🎈', name: 'Balloon', threshold: 220 },
  { id: 'penguin', emoji: '🐧', name: 'Penguin', threshold: 260 },
  { id: 'lion', emoji: '🦁', name: 'Lion', threshold: 300 },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', threshold: 350 },
  { id: 'guitar', emoji: '🎸', name: 'Guitar', threshold: 400 },
  { id: 'crown', emoji: '👑', name: 'Crown', threshold: 500 },
];

export function unlockedStickers(stars: number): Sticker[] {
  return STICKERS.filter((sticker) => stars >= sticker.threshold);
}

export function nextSticker(stars: number): Sticker | null {
  return STICKERS.find((sticker) => stars < sticker.threshold) ?? null;
}
