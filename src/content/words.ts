export type Word = {
  word: string;
  syllables: string[];
  emoji: string;
};

/** Two-syllable words with concrete, child-friendly pictures. */
export const WORDS_2: Word[] = [
  { word: 'rabbit', syllables: ['rab', 'bit'], emoji: '🐰' },
  { word: 'rocket', syllables: ['rock', 'et'], emoji: '🚀' },
  { word: 'pencil', syllables: ['pen', 'cil'], emoji: '✏️' },
  { word: 'tiger', syllables: ['ti', 'ger'], emoji: '🐯' },
  { word: 'monkey', syllables: ['mon', 'key'], emoji: '🐵' },
  { word: 'water', syllables: ['wa', 'ter'], emoji: '💧' },
  { word: 'apple', syllables: ['ap', 'ple'], emoji: '🍎' },
  { word: 'pizza', syllables: ['piz', 'za'], emoji: '🍕' },
  { word: 'cookie', syllables: ['cook', 'ie'], emoji: '🍪' },
  { word: 'baby', syllables: ['ba', 'by'], emoji: '👶' },
  { word: 'flower', syllables: ['flow', 'er'], emoji: '🌸' },
  { word: 'button', syllables: ['but', 'ton'], emoji: '🔘' },
  { word: 'lemon', syllables: ['lem', 'on'], emoji: '🍋' },
  { word: 'teddy', syllables: ['ted', 'dy'], emoji: '🧸' },
  { word: 'window', syllables: ['win', 'dow'], emoji: '🪟' },
  { word: 'basket', syllables: ['bas', 'ket'], emoji: '🧺' },
  { word: 'dolphin', syllables: ['dol', 'phin'], emoji: '🐬' },
  { word: 'pumpkin', syllables: ['pump', 'kin'], emoji: '🎃' },
];

/** Three-syllable words, introduced after the two-syllable set feels easy. */
export const WORDS_3: Word[] = [
  { word: 'banana', syllables: ['ba', 'na', 'na'], emoji: '🍌' },
  { word: 'elephant', syllables: ['el', 'e', 'phant'], emoji: '🐘' },
  { word: 'butterfly', syllables: ['but', 'ter', 'fly'], emoji: '🦋' },
  { word: 'dinosaur', syllables: ['di', 'no', 'saur'], emoji: '🦕' },
  { word: 'umbrella', syllables: ['um', 'brel', 'la'], emoji: '☂️' },
  { word: 'computer', syllables: ['com', 'pu', 'ter'], emoji: '💻' },
  { word: 'tomato', syllables: ['to', 'ma', 'to'], emoji: '🍅' },
  { word: 'potato', syllables: ['po', 'ta', 'to'], emoji: '🥔' },
  { word: 'crocodile', syllables: ['croc', 'o', 'dile'], emoji: '🐊' },
  { word: 'strawberry', syllables: ['straw', 'ber', 'ry'], emoji: '🍓' },
  { word: 'pineapple', syllables: ['pine', 'ap', 'ple'], emoji: '🍍' },
  { word: 'kangaroo', syllables: ['kan', 'ga', 'roo'], emoji: '🦘' },
  { word: 'violin', syllables: ['vi', 'o', 'lin'], emoji: '🎻' },
  { word: 'hospital', syllables: ['hos', 'pi', 'tal'], emoji: '🏥' },
  { word: 'bicycle', syllables: ['bi', 'cy', 'cle'], emoji: '🚲' },
  { word: 'camera', syllables: ['cam', 'er', 'a'], emoji: '📷' },
];

export const ALL_WORDS: Word[] = [...WORDS_2, ...WORDS_3];

export function wordsForSyllableCount(count: 2 | 3): Word[] {
  return count === 2 ? WORDS_2 : WORDS_3;
}
