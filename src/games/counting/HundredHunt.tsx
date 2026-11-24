import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { HundredChart } from '../../components/HundredChart';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { praise, randInt } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

export function HundredHunt({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <HuntQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function HuntQuestion({ onCorrect }: { onCorrect: () => void }) {
  const target = useMemo(() => randInt(1, 100), []);
  const [solved, setSolved] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak(`Find number ${target}.`);
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, [target]);

  const choose = (value: number) => {
    if (solved !== null) return;

    if (value === target) {
      setSolved(value);
      playSfx('correct');
      speak(`Yes! ${target}. ${praise()}`);
      advance(1550);
      return;
    }

    setWrong(value);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak(`Not quite. Find ${target}.`);
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrong(null), 420);
  };

  return (
    <div className="question-card hunt-card">
      <div className="hunt-target" aria-label={`Find number ${target}`}>
        <span className="hunt-eyebrow">Find</span>
        <span className="hunt-number">{target}</span>
      </div>

      <Prompt
        text="Tap the number"
        onSpeak={() => speak(`Find number ${target}.`)}
      />

      <HundredChart
        target={target}
        solved={solved}
        wrong={wrong}
        hint={wrongCount >= 2 && solved === null}
        onPick={choose}
      />
    </div>
  );
}
