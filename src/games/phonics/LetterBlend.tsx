import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { PHONIC_WORDS } from '../../content/phonics';
import { playSfx, speak } from '../../lib/audio';
import { praise, pick, shuffle } from '../../lib/random';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };
type Tile = { id: number; text: string };

export function LetterBlend({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5, 'words');

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <BlendQuestion key={round.done} onDone={round.award} />
    </GameBox>
  );
}

function BlendQuestion({ onDone }: { onDone: () => void }) {
  const word = useMemo(() => pick(PHONIC_WORDS), []);
  const letters = word.word.split('');
  const tiles = useMemo<Tile[]>(
    () => shuffle(letters.map((text, id) => ({ id, text }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [word.word],
  );

  const [used, setUsed] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const shakeTimer = useRef<number | null>(null);
  const cheerTimer = useRef<number | null>(null);

  const placed = used.map((id) => tiles.find((tile) => tile.id === id)?.text ?? '');
  const nextExpected = letters[used.length];

  useEffect(() => {
    speak(`Build the word ${word.word}.`);
  }, [word.word]);

  useEffect(
    () => () => {
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
      if (cheerTimer.current !== null) window.clearTimeout(cheerTimer.current);
    },
    [],
  );

  const tapTile = (tile: Tile) => {
    if (complete) return;

    if (tile.text === nextExpected) {
      playSfx('pop');
      speak(tile.text);
      const next = [...used, tile.id];
      setUsed(next);

      if (next.length === letters.length) {
        setComplete(true);
        cheerTimer.current = window.setTimeout(() => {
          playSfx('star');
          speak(`${word.word}! ${praise()}`);
        }, 360);
      }
      return;
    }

    setShake(tile.id);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again.');
    if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => setShake(null), 420);
  };

  return (
    <div className="question-card build-card">
      <div className="hero-emoji small" aria-hidden>
        {word.emoji}
      </div>

      <Prompt text="Build the word" onSpeak={() => speak(`Build the word ${word.word}.`)} />

      <div className="word-slots" role="group" aria-label={`${letters.length} letters`}>
        {letters.map((_, index) => (
          <div key={index} className={`slot ${index < placed.length ? 'filled' : ''}`}>
            {placed[index] ?? ''}
          </div>
        ))}
      </div>

      <div className="tile-bank">
        {tiles.map((tile) => {
          const isUsed = used.includes(tile.id);
          const isHint = !complete && wrongCount >= 2 && tile.text === nextExpected && !isUsed;
          return (
            <button
              key={tile.id}
              type="button"
              className={`syllable-tile ${isUsed ? 'used' : ''} ${
                shake === tile.id ? 'wrong' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => tapTile(tile)}
              disabled={isUsed || complete}
              aria-label={`Letter ${tile.text}`}
            >
              {tile.text}
            </button>
          );
        })}
      </div>

      {complete ? (
        <div className="build-done">
          <p className="build-word">
            {word.emoji} {word.word}
          </p>
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
        </div>
      ) : null}
    </div>
  );
}
