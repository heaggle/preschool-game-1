import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { PATTERN_TOKENS } from '../../content/logic';
import { playSfx, speak } from '../../lib/audio';
import { pick, praise, sample, shuffle } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

export function PatternGame({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5, 'logic');

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <PatternQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function PatternQuestion({ onCorrect }: { onCorrect: () => void }) {
  const setup = useMemo(() => {
    const length = pick([2, 3]);
    const tokens = sample(PATTERN_TOKENS, length);
    const visible = length === 2 ? 4 : 5;
    const answer = tokens[visible % length];
    const distractors = sample(
      PATTERN_TOKENS.filter((token) => !tokens.includes(token)),
      2,
    );
    return { tokens, visible, answer, choices: shuffle([answer, ...distractors]) };
  }, []);

  const [answered, setAnswered] = useState(false);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak('Continue the pattern.');
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, []);

  const choose = (token: string) => {
    if (answered) return;

    if (token === setup.answer) {
      setAnswered(true);
      setWrongPick(null);
      playSfx('correct');
      speak(praise());
      advance(1500);
      return;
    }

    setWrongPick(token);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again.');
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrongPick(null), 450);
  };

  return (
    <div className="question-card">
      <Prompt text="Continue the pattern" onSpeak={() => speak('Continue the pattern.')} />

      <div className="pattern-row" role="group" aria-label="Pattern">
        {Array.from({ length: setup.visible }, (_, index) => (
          <span key={index} className="pattern-item" aria-hidden>
            {setup.tokens[index % setup.tokens.length]}
          </span>
        ))}
        <span className={`pattern-item ${answered ? '' : 'blank'}`} aria-label="answer">
          {answered ? setup.answer : '?'}
        </span>
      </div>

      <div className="option-grid">
        {setup.choices.map((token) => {
          const isRight = answered && token === setup.answer;
          const isHint = !answered && wrongCount >= 2 && token === setup.answer;
          return (
            <button
              key={token}
              type="button"
              className={`option-card ${wrongPick === token ? 'wrong' : ''} ${
                isRight ? 'right' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => choose(token)}
              disabled={answered}
              aria-label="shape"
            >
              <span className="option-emoji" aria-hidden>
                {token}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
