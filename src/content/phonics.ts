export type PhonicWord = {
  word: string;
  emoji: string;
  /** Rhyme group id (e.g. 'at' for cat/hat/bat). */
  family: string;
  /** First letter, lowercase. */
  initial: string;
};

/**
 * Decodable CVC (consonant–vowel–consonant) words — the Montessori "pink
 * series". Every word is 3 letters so it can be blended sound by sound.
 * Words are grouped into families so rhyme games always have a partner.
 */
export const PHONIC_WORDS: PhonicWord[] = [
  // -at
  { word: 'cat', emoji: '🐱', family: 'at', initial: 'c' },
  { word: 'hat', emoji: '🎩', family: 'at', initial: 'h' },
  { word: 'bat', emoji: '🦇', family: 'at', initial: 'b' },
  { word: 'rat', emoji: '🐀', family: 'at', initial: 'r' },
  // -og
  { word: 'dog', emoji: '🐶', family: 'og', initial: 'd' },
  { word: 'log', emoji: '🪵', family: 'og', initial: 'l' },
  { word: 'fog', emoji: '🌫️', family: 'og', initial: 'f' },
  // -un
  { word: 'sun', emoji: '☀️', family: 'un', initial: 's' },
  { word: 'bun', emoji: '🥟', family: 'un', initial: 'b' },
  { word: 'run', emoji: '🏃', family: 'un', initial: 'r' },
  // -ig
  { word: 'pig', emoji: '🐷', family: 'ig', initial: 'p' },
  { word: 'fig', emoji: '🍈', family: 'ig', initial: 'f' },
  { word: 'wig', emoji: '👱', family: 'ig', initial: 'w' },
  // -en
  { word: 'hen', emoji: '🐔', family: 'en', initial: 'h' },
  { word: 'pen', emoji: '🖊️', family: 'en', initial: 'p' },
  { word: 'ten', emoji: '🔟', family: 'en', initial: 't' },
  // -ed
  { word: 'red', emoji: '🔴', family: 'ed', initial: 'r' },
  { word: 'bed', emoji: '🛏️', family: 'ed', initial: 'b' },
  // -ox
  { word: 'fox', emoji: '🦊', family: 'ox', initial: 'f' },
  { word: 'box', emoji: '📦', family: 'ox', initial: 'b' },
  // -up
  { word: 'cup', emoji: '☕', family: 'up', initial: 'c' },
  { word: 'pup', emoji: '🐩', family: 'up', initial: 'p' },
  // -ap
  { word: 'map', emoji: '🗺️', family: 'ap', initial: 'm' },
  { word: 'tap', emoji: '🚰', family: 'ap', initial: 't' },
  { word: 'cap', emoji: '🧢', family: 'ap', initial: 'c' },
  // -ug
  { word: 'bug', emoji: '🐞', family: 'ug', initial: 'b' },
  { word: 'jug', emoji: '🏺', family: 'ug', initial: 'j' },
  { word: 'rug', emoji: '🧶', family: 'ug', initial: 'r' },
  { word: 'hug', emoji: '🤗', family: 'ug', initial: 'h' },
];

export function wordsInFamily(family: string, exclude?: string): PhonicWord[] {
  return PHONIC_WORDS.filter((word) => word.family === family && word.word !== exclude);
}

export function wordsWithInitial(initial: string, exclude?: string): PhonicWord[] {
  return PHONIC_WORDS.filter((word) => word.initial === initial && word.word !== exclude);
}

export function wordsWithOtherInitial(initial: string): PhonicWord[] {
  return PHONIC_WORDS.filter((word) => word.initial !== initial);
}

export function wordsWithOtherFamily(family: string): PhonicWord[] {
  return PHONIC_WORDS.filter((word) => word.family !== family);
}
