import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { ContinentsGame } from '../games/geography/ContinentsGame';
import { FlagsGame } from '../games/geography/FlagsGame';
import { LanguagesGame } from '../games/geography/LanguagesGame';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  continents: 'Continents',
  flags: 'Flags & Countries',
  languages: 'Languages',
};

export function GeographyScreen({
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
  const valid = activity === 'continents' || activity === 'flags' || activity === 'languages';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Geography"
          emoji="🌍"
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Choose a geography game.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">Planet Earth, continents, countries and flags.</p>

        <div className="menu-grid">
          <MenuCard
            emoji="🌍"
            title="Continents"
            subtitle="The 7 continents"
            accent="sky"
            onClick={() => onSelect('continents')}
          />
          <MenuCard
            emoji="🚩"
            title="Flags & Countries"
            subtitle="Match the flag"
            accent="mint"
            onClick={() => onSelect('flags')}
          />
          <MenuCard
            emoji="💬"
            title="Languages"
            subtitle="Who says it?"
            accent="grape"
            onClick={() => onSelect('languages')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'continents':
        return <ContinentsGame onAgain={again} onHome={onHome} />;
      case 'flags':
        return <FlagsGame onAgain={again} onHome={onHome} />;
      case 'languages':
        return <LanguagesGame onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Geography'}
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
