import { useState } from 'react';
import { BuildWord } from '../games/words/BuildWord';
import { HearAndFind } from '../games/words/HearAndFind';
import { ReadTogether } from '../games/words/ReadTogether';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  find: 'Hear & Find',
  read: 'Read Together',
  build2: 'Build a Word',
  build3: 'Big Words',
};

export function WordsScreen({
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
    activity === 'find' || activity === 'read' || activity === 'build2' || activity === 'build3';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Words"
          emoji="📖"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose a word game.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Listen, read, and build words.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="👂"
            title="Hear & Find"
            subtitle="Listen and pick"
            accent="sky"
            onClick={() => onSelect('find')}
          />
          <MenuCard
            emoji="📖"
            title="Read Together"
            subtitle="Tap the parts"
            accent="grape"
            onClick={() => onSelect('read')}
          />
          <MenuCard
            emoji="🧩"
            title="Build a Word"
            subtitle="2 syllables"
            accent="mint"
            onClick={() => onSelect('build2')}
          />
          <MenuCard
            emoji="🧱"
            title="Big Words"
            subtitle="3 syllables"
            accent="sun"
            onClick={() => onSelect('build3')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'find':
        return <HearAndFind onAgain={again} onHome={onHome} />;
      case 'read':
        return <ReadTogether onAgain={again} onHome={onHome} />;
      case 'build2':
        return <BuildWord syllables={2} onAgain={again} onHome={onHome} />;
      case 'build3':
        return <BuildWord syllables={3} onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Words'}
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
