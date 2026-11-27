import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { LettersExploration } from '../games/talents/LettersExploration';
import { LogicExploration } from '../games/talents/LogicExploration';
import { NumbersExploration } from '../games/talents/NumbersExploration';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  numbers: 'Numbers',
  letters: 'Letters',
  logic: 'Logic',
};

export function TalentsScreen({
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
  const valid = activity === 'numbers' || activity === 'letters' || activity === 'logic';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Explorations"
          emoji="🧩"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose a fun challenge.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Three little challenges to play and discover.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="🔢"
            title="Numbers"
            subtitle="How many?"
            accent="coral"
            onClick={() => onSelect('numbers')}
          />
          <MenuCard
            emoji="🔤"
            title="Letters"
            subtitle="Find the word"
            accent="grape"
            onClick={() => onSelect('letters')}
          />
          <MenuCard
            emoji="🧩"
            title="Logic"
            subtitle="Which is different?"
            accent="mint"
            onClick={() => onSelect('logic')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'numbers':
        return <NumbersExploration onAgain={again} onHome={onHome} />;
      case 'letters':
        return <LettersExploration onAgain={again} onHome={onHome} />;
      case 'logic':
        return <LogicExploration onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Explorations'}
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
