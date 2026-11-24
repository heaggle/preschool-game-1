import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { praise, randInt, shuffle } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

const TENS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function TensCount({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <TensQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function TensQuestion({ onCorrect }: { onCorrect: () => void }) {
  const setup = useMemo(() => {
    const blank = randInt(1, 8);
    const answer = TENS[blank];
    const choices = shuffle([
      answer,
      ...shuffle(TENS.filter((value) => value !== answer)).slice(0, 2),
    ]);
    return { blank, answer, choices };
  }, []);

  const [answered, setAnswered] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak('Count by tens. What number is missing?');
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, []);

  const choose = (value: number) => {
    if (answered) return;

    if (value === setup.answer) {
      setAnswered(true);
      setWrongChoice(null);
      playSfx('correct');
      speak(`${setup.answer}! ${praise()}`);
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
    <div className="question-card tens-card">
      <Prompt
        text="Count by 10s"
        onSpeak={() => speak('Count by tens. What number is missing?')}
      />

      <div className="tens-grid">
        {TENS.map((value, index) => (
          <div
            key={value}
            className={`tens-item ${index === setup.blank ? 'blank' : ''}`}
          >
            {index === setup.blank ? '?' : value}
          </div>
        ))}
      </div>

      <div className="choice-grid">
        {setup.choices.map((value) => {
          const isRight = answered && value === setup.answer;
          const isHint = !answered && wrongCount >= 2 && value === setup.answer;
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
