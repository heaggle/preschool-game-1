import {
  PHONIC_WORDS,
  wordsInFamily,
  wordsWithOtherFamily,
} from '../../content/phonics';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(PHONIC_WORDS);
  const answer = pick(wordsInFamily(target.family, target.word));
  const distractors = sample(wordsWithOtherFamily(target.family), 2);
  const options = shuffle([
    { key: answer.word, label: answer.word },
    ...distractors.map((d) => ({ key: d.word, label: d.word })),
  ]);
  return {
    prompt: 'Which one rhymes?',
    speakText: `Which word rhymes with ${target.word}?`,
    promptEmoji: target.emoji,
    options,
    answer: answer.word,
    answerText: answer.word,
    bigLabels: true,
  };
}

export function RhymeGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="words" />;
}
