import { PHONIC_WORDS } from '../../content/phonics';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(PHONIC_WORDS);
  const distractors = sample(
    PHONIC_WORDS.filter((word) => word.word !== target.word),
    2,
  );
  const options = shuffle([
    { key: target.word, label: target.word },
    ...distractors.map((d) => ({ key: d.word, label: d.word })),
  ]);
  return {
    prompt: 'Find the word',
    speakText: `Find the word ${target.word}.`,
    promptEmoji: target.emoji,
    options,
    answer: target.word,
    answerText: target.word,
    bigLabels: true,
  };
}

export function FindWordGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="words" />;
}
