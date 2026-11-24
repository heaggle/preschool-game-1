import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { buildChoices, praise, randInt } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

export function NextNumber({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <NextQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function NextQuestion({ onCorrect }: { onCorrect: () => void }) {
  const setup = useMemo(() => {
    const start = randInt(1, 17);
    const sequence = [start, start + 1, start + 2, start + 3];
    const blank = randInt(1, 3);
    return {
      sequence,
      blank,
      answer: sequence[blank],
      choices: buildChoices(sequence[blank], 3, 1),
    };
  }, []);

  const [answered, setAnswered] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak('What number is missing?');
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
    <div className="question-card">
      <Prompt
        text="What number is missing?"
        onSpeak={() => speak('What number is missing?')}
      />

      <div className="seq-row">
        {setup.sequence.map((value, index) => (
          <div
            key={index}
            className={`seq-item ${index === setup.blank ? 'blank' : ''}`}
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
