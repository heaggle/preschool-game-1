import { PROVINCES } from '../../content/madagascar';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(PROVINCES);
  const distractors = sample(
    PROVINCES.filter((province) => province.id !== target.id),
    2,
  );
  const options = shuffle([
    { key: target.id, label: target.name },
    ...distractors.map((d) => ({ key: d.id, label: d.name })),
  ]);
  return {
    prompt: 'Which province?',
    speakText: `Which province is in the ${target.zone}?`,
    options,
    answer: target.id,
    answerText: target.name,
  };
}

export function ProvincesGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="madagascar" />;
}
