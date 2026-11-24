import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { buildChoices, praise } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';
import { makeProblem, type MathKind } from './mathGen';

type GameProps = {
  kind: MathKind;
  max: number;
  onAgain: () => void;
  onHome: () => void;
};

export function MathGame({ kind, max, onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <MathQuestion key={round.done} kind={kind} max={max} onCorrect={round.award} />
    </GameBox>
  );
}

function MathQuestion({
  kind,
  max,
  onCorrect,
}: {
  kind: MathKind;
  max: number;
  onCorrect: () => void;
}) {
  const problem = useMemo(() => makeProblem(kind, max), [kind, max]);
  const choices = useMemo(
    () => buildChoices(problem.answer, 3, 0),
    [problem.answer],
  );

  const [answered, setAnswered] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  const instruction =
    problem.kind === 'add'
      ? `${problem.a} plus ${problem.b}. How many?`
      : `${problem.a} take away ${problem.b}. How many are left?`;

  useEffect(() => {
    speak(instruction);
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, [instruction]);

  const choose = (value: number) => {
    if (answered) return;

    if (value === problem.answer) {
      setAnswered(true);
      setWrongChoice(null);
      playSfx('correct');
      speak(`${problem.answer}! ${praise()}`);
      advance(1550);
      return;
    }

    setWrongChoice(value);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again. Count them.');
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrongChoice(null), 450);
  };

  return (
    <div className="question-card math-card">
      <Prompt text="How many?" onSpeak={() => speak(instruction)} />

      <div className="equation" aria-label={instruction}>
        <span>{problem.a}</span>
        <span className="math-op">{problem.kind === 'add' ? '+' : '−'}</span>
        <span>{problem.b}</span>
        <span className="math-op">=</span>
        <span className="eq-box">?</span>
      </div>

      <div className="math-visual" aria-hidden>
        {problem.kind === 'add' ? (
          <>
            <div className="dot-group grape">
              {Array.from({ length: problem.a }, (_, index) => (
                <span key={index} className="dot" />
              ))}
            </div>
            <span className="math-op">+</span>
            <div className="dot-group coral">
              {Array.from({ length: problem.b }, (_, index) => (
                <span key={index} className="dot coral" />
              ))}
            </div>
          </>
        ) : (
          <div className="dot-group subtract">
            {Array.from({ length: problem.a }, (_, index) => (
              <span
                key={index}
                className={`dot ${index >= problem.a - problem.b ? 'crossed' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="choice-grid">
        {choices.map((value) => {
          const isRight = answered && value === problem.answer;
          const isHint = !answered && wrongCount >= 2 && value === problem.answer;
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
