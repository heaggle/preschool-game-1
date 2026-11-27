import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { praise } from '../../lib/random';
import type { Domain } from '../../lib/storage';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

export type GameProps = { onAgain: () => void; onHome: () => void };

export type PickOption = { key: string; emoji?: string; label: string };

export type PickRound = {
  /** Short instruction shown on screen. */
  prompt: string;
  /** Full sentence read aloud. */
  speakText: string;
  options: PickOption[];
  answer: string;
  /** Spoken when the answer is correct (e.g. the country name). */
  answerText: string;
  /** Hide labels until answered (used for flag recognition). */
  hideLabels?: boolean;
  /** Big picture shown above the prompt (e.g. the target word's image). */
  promptEmoji?: string;
  /** Render option labels in a large, readable word style. */
  bigLabels?: boolean;
};

/**
 * A small "listen and pick" round shared by the Geography and Madagascar
 * modules. It mirrors the choice pattern used by the existing games.
 */
export function PickGame({
  makeRound,
  onAgain,
  onHome,
  onResult,
  domain,
}: {
  makeRound: () => PickRound;
  onAgain: () => void;
  onHome: () => void;
  onResult?: (correctFirstTry: boolean) => void;
  domain?: Domain;
}) {
  const round = useGameRound(5, domain);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <PickQuestion
        key={round.done}
        makeRound={makeRound}
        onCorrect={round.award}
        onResult={onResult}
      />
    </GameBox>
  );
}

function PickQuestion({
  makeRound,
  onCorrect,
  onResult,
}: {
  makeRound: () => PickRound;
  onCorrect: () => void;
  onResult?: (correctFirstTry: boolean) => void;
}) {
  const setup = useMemo(() => makeRound(), [makeRound]);
  const [answered, setAnswered] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak(setup.speakText);
    return () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, [setup.speakText]);

  const choose = (key: string) => {
    if (answered) return;

    if (key === setup.answer) {
      setAnswered(true);
      setWrongKey(null);
      onResult?.(wrongCount === 0);
      playSfx('correct');
      speak(`${setup.answerText}! ${praise()}`);
      advance(1500);
      return;
    }

    setWrongKey(key);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again.');
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrongKey(null), 450);
  };

  return (
    <div className="question-card">
      {setup.promptEmoji ? (
        <div className="hero-emoji small" aria-hidden>
          {setup.promptEmoji}
        </div>
      ) : null}

      <Prompt text={setup.prompt} onSpeak={() => speak(setup.speakText)} />

      <div className={`option-grid${setup.options.length === 4 ? ' four' : ''}`}>
        {setup.options.map((option) => {
          const isRight = answered && option.key === setup.answer;
          const isHint = !answered && wrongCount >= 2 && option.key === setup.answer;
          const showLabel = !setup.hideLabels || isRight;
          return (
            <button
              key={option.key}
              type="button"
              className={`option-card ${wrongKey === option.key ? 'wrong' : ''} ${
                isRight ? 'right' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => choose(option.key)}
              disabled={answered}
              aria-label={option.label}
            >
              {option.emoji ? (
                <span className="option-emoji" aria-hidden>
                  {option.emoji}
                </span>
              ) : null}
              <span className={`option-label${setup.bigLabels ? ' big' : ''}`}>
                {showLabel ? option.label : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
