import { useState } from 'react';
import { MenuCard } from '../components/MenuCard';
import { IconButton, ScreenHeader } from '../components/ui';
import { EthnicitiesGame } from '../games/madagascar/EthnicitiesGame';
import { NatureGame } from '../games/madagascar/NatureGame';
import { PlacesGame } from '../games/madagascar/PlacesGame';
import { ProvincesGame } from '../games/madagascar/ProvincesGame';
import { MADAGASCAR_CAPITAL, MADAGASCAR_FLAG } from '../content/madagascar';
import { speak } from '../lib/audio';

const TITLES: Record<string, string> = {
  provinces: 'Provinces',
  places: 'Famous Places',
  nature: 'Nature',
  ethnicities: 'The 18 Peoples',
};

export function MadagascarScreen({
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
    activity === 'provinces' ||
    activity === 'places' ||
    activity === 'nature' ||
    activity === 'ethnicities';

  if (!valid) {
    return (
      <div className="screen">
        <ScreenHeader
          title="Madagascar"
          emoji={MADAGASCAR_FLAG}
          onBack={onBack}
          right={
            <IconButton
              label="Hear the instructions"
              onClick={() => speak('Discover Madagascar: provinces, places, nature and peoples.')}
            >
              🔊
            </IconButton>
          }
        />
        <p className="screen-sub">
          {MADAGASCAR_FLAG} My island — the capital is {MADAGASCAR_CAPITAL}.
        </p>

        <div className="menu-grid">
          <MenuCard
            emoji="🗺️"
            title="Provinces"
            subtitle="The 6 provinces"
            accent="sky"
            onClick={() => onSelect('provinces')}
          />
          <MenuCard
            emoji="🏝️"
            title="Famous Places"
            subtitle="Baobabs, Tsingy, Nosy Be…"
            accent="mint"
            onClick={() => onSelect('places')}
          />
          <MenuCard
            emoji="🐒"
            title="Nature"
            subtitle="Lemurs & friends"
            accent="grape"
            onClick={() => onSelect('nature')}
          />
          <MenuCard
            emoji="👥"
            title="The 18 Peoples"
            subtitle="The foko 18"
            accent="sun"
            onClick={() => onSelect('ethnicities')}
          />
        </div>
      </div>
    );
  }

  const game = (() => {
    switch (activity) {
      case 'provinces':
        return <ProvincesGame onAgain={again} onHome={onHome} />;
      case 'places':
        return <PlacesGame onAgain={again} onHome={onHome} />;
      case 'nature':
        return <NatureGame onAgain={again} onHome={onHome} />;
      case 'ethnicities':
        return <EthnicitiesGame onAgain={again} onHome={onHome} />;
      default:
        return null;
    }
  })();

  return (
    <div className="screen">
      <ScreenHeader
        title={TITLES[activity] ?? 'Madagascar'}
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
