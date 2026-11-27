import { COUNTRIES } from '../../content/geography';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(COUNTRIES);
  const distractors = sample(
    COUNTRIES.filter((country) => country.id !== target.id),
    2,
  );
  const options = shuffle([
    { key: target.id, emoji: target.flag, label: target.name },
    ...distractors.map((d) => ({ key: d.id, emoji: d.flag, label: d.name })),
  ]);
  return {
    prompt: 'Find the flag',
    speakText: `Find the flag of ${target.name}.`,
    options,
    answer: target.id,
    answerText: target.name,
    hideLabels: true,
  };
}

export function FlagsGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="geography" />;
}
