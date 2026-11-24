import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { praise, pick, shuffle } from '../../lib/random';
import { useGameRound } from '../../lib/useGameRound';
import { wordsForSyllableCount } from '../../content/words';

type GameProps = {
  syllables: 2 | 3;
  onAgain: () => void;
  onHome: () => void;
};

export function BuildWord({ syllables, onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <BuildQuestion key={round.done} level={syllables} onDone={round.award} />
    </GameBox>
  );
}

type Tile = { id: number; text: string };

function BuildQuestion({ level, onDone }: { level: 2 | 3; onDone: () => void }) {
  const word = useMemo(() => pick(wordsForSyllableCount(level)), [level]);
  const tiles = useMemo<Tile[]>(
    () => shuffle(word.syllables.map((text, id) => ({ id, text }))),
    [word],
  );

  const [used, setUsed] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const shakeTimer = useRef<number | null>(null);
  const cheerTimer = useRef<number | null>(null);

  const placed = used.map((id) => tiles.find((tile) => tile.id === id)?.text ?? '');
  const nextExpected = word.syllables[used.length];

  useEffect(() => {
    speak(`Build the word: ${word.word}.`);
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

      if (next.length === word.syllables.length) {
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

  const sayWord = () => speak(`Build the word: ${word.word}.`);

  return (
    <div className="question-card build-card">
      <div className="hero-emoji small" aria-hidden>
        {word.emoji}
      </div>

      <Prompt text="Build the word" onSpeak={sayWord} />

      <div className="word-slots" role="group" aria-label={`${word.syllables.length} parts`}>
        {word.syllables.map((_, index) => (
          <div key={index} className={`slot ${index < placed.length ? 'filled' : ''}`}>
            {placed[index] ?? ''}
          </div>
        ))}
      </div>

      <div className="tile-bank">
        {tiles.map((tile) => {
          const isUsed = used.includes(tile.id);
          const isHint =
            !complete && wrongCount >= 2 && tile.text === nextExpected && !isUsed;
          return (
            <button
              key={tile.id}
              type="button"
              className={`syllable-tile ${isUsed ? 'used' : ''} ${
                shake === tile.id ? 'wrong' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => tapTile(tile)}
              disabled={isUsed || complete}
              aria-label={`Part ${tile.text}`}
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
