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
    prompt: 'Who says it?',
    speakText: `Where do people say ${target.greeting}?`,
    options,
    answer: target.id,
    answerText: target.name,
  };
}

export function LanguagesGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="geography" />;
}
