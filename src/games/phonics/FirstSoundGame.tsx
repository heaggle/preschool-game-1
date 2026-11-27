import {
  PHONIC_WORDS,
  wordsWithInitial,
  wordsWithOtherInitial,
} from '../../content/phonics';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  // Only target words that actually have a same-initial partner.
  const candidates = PHONIC_WORDS.filter(
    (word) => wordsWithInitial(word.initial, word.word).length > 0,
  );
  const target = pick(candidates);
  const answer = pick(wordsWithInitial(target.initial, target.word));
  const distractors = sample(wordsWithOtherInitial(target.initial), 2);
  const options = shuffle([
    { key: answer.word, label: answer.word },
    ...distractors.map((d) => ({ key: d.word, label: d.word })),
  ]);
  return {
    prompt: 'Same first sound?',
    speakText: `Which word starts like ${target.word}?`,
    promptEmoji: target.emoji,
    options,
    answer: answer.word,
    answerText: answer.word,
    bigLabels: true,
  };
}

export function FirstSoundGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="words" />;
}
