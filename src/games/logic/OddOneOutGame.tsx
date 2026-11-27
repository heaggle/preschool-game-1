import { CATEGORY_GROUPS } from '../../content/logic';
import { pick, sample, shuffle } from '../../lib/random';
import { PickGame, type GameProps, type PickRound } from '../shared/PickGame';

function makeRound(): PickRound {
  const [mainGroup, otherGroup] = sample(CATEGORY_GROUPS, 2);
  const sameItems = sample(mainGroup.items, 3);
  const oddItem = pick(otherGroup.items);
  const options = shuffle([
    ...sameItems.map((item) => ({ key: item.id, emoji: item.emoji, label: item.label })),
    { key: oddItem.id, emoji: oddItem.emoji, label: oddItem.label },
  ]);
  return {
    prompt: 'Which one is different?',
    speakText: 'Which one is different?',
    options,
    answer: oddItem.id,
    answerText: oddItem.label,
    hideLabels: true,
  };
}

export function OddOneOutGame({ onAgain, onHome }: GameProps) {
  return <PickGame makeRound={makeRound} onAgain={onAgain} onHome={onHome} domain="logic" />;
}
