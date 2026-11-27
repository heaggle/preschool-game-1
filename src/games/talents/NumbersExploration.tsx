import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { buildChoices, praise, randInt } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';
import { useApp } from '../../state/AppContext';

type GameProps = { onAgain: () => void; onHome: () => void };

export function NumbersExploration({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <HowManyQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function HowManyQuestion({ onCorrect }: { onCorrect: () => void }) {
  const { recordTalent } = useApp();
  const setup = useMemo(() => {
    const count = randInt(1, 6);
    return { count, choices: buildChoices(count, 3, 1) };
  }, []);

  const [answered, setAnswered] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak('How many dots?');
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, []);

  const choose = (value: number) => {
    if (answered) return;

    if (value === setup.count) {
      setAnswered(true);
      setWrongChoice(null);
      recordTalent('math', wrongCount === 0);
      playSfx('correct');
      speak(`${setup.count}! ${praise()}`);
      advance(1500);
      return;
    }

    setWrongChoice(value);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again.');
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrongChoice(null), 450);
  };

  return (
    <div className="question-card">
      <Prompt text="How many?" onSpeak={() => speak('How many dots?')} />

      <div className="subitize-tray" aria-label={`${setup.count} dots`}>
        {Array.from({ length: setup.count }, (_, index) => (
          <span key={index} className="subitize-dot" />
        ))}
      </div>

      <div className="choice-grid">
        {setup.choices.map((value) => {
          const isRight = answered && value === setup.count;
          const isHint = !answered && wrongCount >= 2 && value === setup.count;
          return (
            <button
              key={value}
              type="button"
              className={`choice ${wrongChoice === value ? 'wrong' : ''} ${
                isRight ? 'right' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => choose(value)}
              disabled={answered}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
