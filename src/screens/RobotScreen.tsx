import { useState } from 'react';
import { IconButton, ScreenHeader } from '../components/ui';
import { RobotPath } from '../games/robot/RobotPath';

export function RobotScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [run, setRun] = useState(0);

  return (
    <div className="screen">
      <ScreenHeader
        title="Robot"
        emoji="🤖"
        onBack={onBack}
        right={
          <IconButton label="Go home" onClick={onHome}>
            🏠
          </IconButton>
        }
      />
      <div className="game-host">
        <RobotPath key={run} onAgain={() => setRun((value) => value + 1)} onHome={onHome} />
      </div>
    </div>
  );
}
