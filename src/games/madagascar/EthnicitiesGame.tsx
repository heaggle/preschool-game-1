import { ETHNICITIES } from '../../content/madagascar';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const target = pick(ETHNICITIES);
  const otherRegions = [
    ...new Set(
      ETHNICITIES.filter((ethnicity) => ethnicity.region !== target.region).map(
        (ethnicity) => ethnicity.region,
      ),
    ),
  ];
  const distractors = sample(otherRegions, 2);
  const options = shuffle([
    { key: target.region, label: target.region },
    ...distractors.map((region) => ({ key: region, label: region })),
  ]);
  return {
    prompt: 'Where do they live?',
    speakText: `Where do the ${target.name} people live?`,
    options,
    answer: target.region,
    answerText: target.region,
  };
}

export function EthnicitiesGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="madagascar" />;
}
