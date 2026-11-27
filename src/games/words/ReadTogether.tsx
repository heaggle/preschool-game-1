import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { ALL_WORDS } from '../../content/words';
import { playSfx, speak } from '../../lib/audio';
import { pick } from '../../lib/random';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

export function ReadTogether({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5, 'words');

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <ReadQuestion key={round.done} onDone={round.award} />
    </GameBox>
  );
}

function ReadQuestion({ onDone }: { onDone: () => void }) {
  const word = useMemo(() => pick(ALL_WORDS), []);
  const [tapped, setTapped] = useState<Set<number>>(() => new Set());
  const [blended, setBlended] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    speak('Tap each part. Then blend the word.');
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  const tapPart = (index: number) => {
    speak(word.syllables[index]);
    setTapped((current) => new Set(current).add(index));
  };

  const blend = () => {
    setBlended(true);
    speak(word.word);

    const step = 520;
    word.syllables.forEach((_, index) => {
      const show = window.setTimeout(() => setSpeakingIndex(index), index * step);
      timers.current.push(show);
    });
    const clear = window.setTimeout(
      () => setSpeakingIndex(null),
      word.syllables.length * step + 520,
    );
    timers.current.push(clear);
  };

  return (
    <div className="question-card read-card">
      <div className="hero-emoji" aria-hidden>
        {word.emoji}
      </div>

      <Prompt
        text="Read it together"
        onSpeak={() => speak('Tap each part. Then blend the word.')}
      />

      <div className="read-chips" aria-label={`The word ${word.word}`}>
        {word.syllables.map((syllable, index) => (
          <button
            key={`${syllable}-${index}`}
            type="button"
            className={`read-chip ${tapped.has(index) ? 'done' : ''} ${
              speakingIndex === index ? 'speaking' : ''
            }`}
            onClick={() => tapPart(index)}
          >
            {syllable}
          </button>
        ))}
      </div>

      <div className="read-actions">
        {!blended ? (
          <button type="button" className="btn btn-primary" onClick={blend}>
            ✨ Blend it
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-mint"
            onClick={() => {
              playSfx('correct');
              onDone();
            }}
          >
            Next word →
          </button>
        )}
      </div>

      {blended ? <p className="read-word">{word.word}</p> : null}
    </div>
  );
}
