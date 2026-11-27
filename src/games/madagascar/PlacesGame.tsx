import { PLACES } from '../../content/madagascar';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(PLACES);
  const distractors = sample(
    PLACES.filter((place) => place.id !== target.id),
    2,
  );
  const options = shuffle([
    { key: target.id, emoji: target.emoji, label: target.name },
    ...distractors.map((d) => ({ key: d.id, emoji: d.emoji, label: d.name })),
  ]);
  return {
    prompt: 'Find the place',
    speakText: `Find ${target.name}. It is ${target.hint}.`,
    options,
    answer: target.id,
    answerText: target.name,
  };
}

export function PlacesGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="madagascar" />;
}
