import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { MemoryGame } from '../games/logic/MemoryGame';
import { OddOneOutGame } from '../games/logic/OddOneOutGame';
import { PatternGame } from '../games/logic/PatternGame';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  pattern: 'Patterns',
  odd: 'Odd One Out',
  memory: 'Memory',
};

export function LogicScreen({
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
  const valid = activity === 'pattern' || activity === 'odd' || activity === 'memory';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Logic"
          emoji="🧠"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose a thinking game.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Patterns, matching and memory.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="🔴"
            title="Patterns"
            subtitle="Continue the pattern"
            accent="coral"
            onClick={() => onSelect('pattern')}
          />
          <MenuCard
            emoji="🤔"
            title="Odd One Out"
            subtitle="Which is different?"
            accent="grape"
            onClick={() => onSelect('odd')}
          />
          <MenuCard
            emoji="🃏"
            title="Memory"
            subtitle="Find the pairs"
            accent="mint"
            onClick={() => onSelect('memory')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'pattern':
        return <PatternGame onAgain={again} onHome={onHome} />;
      case 'odd':
        return <OddOneOutGame onAgain={again} onHome={onHome} />;
      case 'memory':
        return <MemoryGame onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Logic'}
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
