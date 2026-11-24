import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { CountTap } from '../games/counting/CountTap';
import { HundredHunt } from '../games/counting/HundredHunt';
import { NextNumber } from '../games/counting/NextNumber';
import { TensCount } from '../games/counting/TensCount';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  count: 'Count & Tap',
  next: "What's Next?",
  tens: 'Count by 10s',
  hunt: 'Number Hunt',
};

export function CountingScreen({
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
  const valid =
    activity === 'count' || activity === 'next' || activity === 'tens' || activity === 'hunt';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Counting"
          emoji="🔢"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose a counting game.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Count, find numbers, and count by tens.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="🍎"
            title="Count & Tap"
            subtitle="Touch and count"
            accent="coral"
            onClick={() => onSelect('count')}
          />
          <MenuCard
            emoji="🔗"
            title="What's Next?"
            subtitle="1 to 20"
            accent="sky"
            onClick={() => onSelect('next')}
          />
          <MenuCard
            emoji="🔟"
            title="Count by 10s"
            subtitle="10 to 100"
            accent="grape"
            onClick={() => onSelect('tens')}
          />
          <MenuCard
            emoji="🔍"
            title="Number Hunt"
            subtitle="Find 1 to 100"
            accent="mint"
            onClick={() => onSelect('hunt')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'count':
        return <CountTap onAgain={again} onHome={onHome} />;
      case 'next':
        return <NextNumber onAgain={again} onHome={onHome} />;
      case 'tens':
        return <TensCount onAgain={again} onHome={onHome} />;
      case 'hunt':
        return <HundredHunt onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Counting'}
        onBack={onBack}
        right={
          <IconButton label="Go home" onClick={onHome}>
            🏠
          </IconButton>
        }
      />
      <div key={`${activity}-${run}`} className="game-host">
        {game}
      </div>
    </div>
  );
}
