import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { MathGame } from '../games/math/MathGame';
import type { MathKind } from '../games/math/mathGen';
import { speak } from '../lib/audio';

type Level = { kind: MathKind; max: number; title: string };

const LEVELS: Record<string, Level> = {
  add5: { kind: 'add', max: 5, title: 'Add to 5' },
  add10: { kind: 'add', max: 10, title: 'Add to 10' },
  add20: { kind: 'add', max: 20, title: 'Add to 20' },
  sub5: { kind: 'sub', max: 5, title: 'Take Away 5' },
  sub10: { kind: 'sub', max: 10, title: 'Take Away 10' },
  sub20: { kind: 'sub', max: 20, title: 'Take Away 20' },
};

export function MathScreen({
  activity,
  onSelect,
  onBack,
  onHome,
}: {
  activity?: string;
  onSelect: (activity: string) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const [run, setRun] = useState(0);
  const again = () => setRun((value) => value + 1);
  const level = activity ? LEVELS[activity] : undefined;

  if (!activity || !level) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Math"
          emoji="➕"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose an adding or taking away game.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Add and take away with pictures.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="➕"
            title="Add to 5"
            subtitle="Easy adding"
            accent="mint"
            onClick={() => onSelect('add5')}
          />
          <MenuCard
            emoji="➕"
            title="Add to 10"
            subtitle="Adding"
            accent="sky"
            onClick={() => onSelect('add10')}
          />
          <MenuCard
            emoji="➕"
            title="Add to 20"
            subtitle="Big adding"
            accent="grape"
            onClick={() => onSelect('add20')}
          />
          <MenuCard
            emoji="➖"
            title="Take Away 5"
            subtitle="Easy take away"
            accent="coral"
            onClick={() => onSelect('sub5')}
          />
          <MenuCard
            emoji="➖"
            title="Take Away 10"
            subtitle="Take away"
            accent="sun"
            onClick={() => onSelect('sub10')}
          />
          <MenuCard
            emoji="➖"
            title="Take Away 20"
            subtitle="Big take away"
            accent="coral"
            onClick={() => onSelect('sub20')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <ScreenHeader
        title={level.title}
        onBack={onBack}
        right={
          <IconButton label="Go home" onClick={onHome}>
            🏠
          </IconButton>
        }
      />
      <div key={`${activity}-${run}`} className="game-host">
        <MathGame
          kind={level.kind}
          max={level.max}
          onAgain={again}
          onHome={onHome}
        />
      </div>
    </div>
  );
}
