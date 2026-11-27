import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { MEMORY_ITEMS } from '../../content/logic';
import { playSfx, speak } from '../../lib/audio';
import { praise, sample, shuffle } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };
type Card = { id: number; emoji: string; name: string };

const PAIRS = 4;

export function MemoryGame({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5, 'logic');

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <MemoryBoard key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function MemoryBoard({ onCorrect }: { onCorrect: () => void }) {
  const cards = useMemo<Card[]>(() => {
    const picked = sample(MEMORY_ITEMS, PAIRS);
    return shuffle([...picked, ...picked]).map((item, id) => ({
      id,
      emoji: item.emoji,
      name: item.name,
    }));
  }, []);

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const lock = useRef(false);
  const resetTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  const allMatched = matched.length === PAIRS;

  useEffect(() => {
    speak('Find the pairs. Tap two cards.');
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  useEffect(() => {
    if (allMatched) {
      playSfx('win');
      speak(`${praise()} You found all the pairs!`);
      advance(1600);
    }
  }, [allMatched, advance]);

  const tapCard = (card: Card) => {
    if (lock.current) return;
    if (matched.includes(card.emoji)) return;
    if (flipped.includes(card.id)) return;

    playSfx('pop');
    speak(card.name);

    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      const cardA = cards.find((c) => c.id === next[0])!;
      const cardB = cards.find((c) => c.id === next[1])!;

      if (cardA.emoji === cardB.emoji) {
        lock.current = true;
        resetTimer.current = window.setTimeout(() => {
          setMatched((prev) => [...prev, cardA.emoji]);
          setFlipped([]);
          lock.current = false;
          playSfx('correct');
        }, 350);
      } else {
        lock.current = true;
        resetTimer.current = window.setTimeout(() => {
          setFlipped([]);
          lock.current = false;
          playSfx('error');
        }, 750);
      }
    }
  };

  return (
    <div className="question-card">
      <Prompt text="Find the pairs" onSpeak={() => speak('Find the pairs. Tap two cards.')} />

      <div className="memory-grid">
        {cards.map((card) => {
          const faceUp = matched.includes(card.emoji) || flipped.includes(card.id);
          const isMatched = matched.includes(card.emoji);
          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${faceUp ? '' : 'face-down'} ${isMatched ? 'matched' : ''}`}
              onClick={() => tapCard(card)}
              aria-label={faceUp ? card.name : 'Hidden card'}
            >
              {faceUp ? (
                <span className="memory-emoji" aria-hidden>
                  {card.emoji}
                </span>
              ) : (
                <span className="memory-back" aria-hidden>
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
