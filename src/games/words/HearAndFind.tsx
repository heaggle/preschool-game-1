import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { ALL_WORDS, type Word } from '../../content/words';
import { playSfx, speak } from '../../lib/audio';
import { praise, randInt, sample, shuffle } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

export function HearAndFind({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <FindQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function FindQuestion({ onCorrect }: { onCorrect: () => void }) {
  const [answered, setAnswered] = useState(false);
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  const { target, options } = useMemo(() => {
    const pool = shuffle(ALL_WORDS);
    const word = pool[randInt(0, pool.length - 1)];
    const distractors = sample(
      pool.filter((candidate) => candidate.emoji !== word.emoji),
      2,
    );
    return { target: word, options: shuffle([word, ...distractors]) };
  }, []);

  useEffect(() => {
    speak(`Find the ${target.word}.`);
  }, [target.word]);

  useEffect(
    () => () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    },
    [],
  );

  const choose = (word: Word) => {
    if (answered) return;

    if (word.emoji === target.emoji) {
      setAnswered(true);
      playSfx('correct');
      speak(`Yes! ${target.word}. ${praise()}`);
      advance(1550);
      return;
    }

    setWrongWord(word.word);
    setWrongCount((count) => count + 1);
    playSfx('error');
    if (wrongCount === 0) speak('Try again.');
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => setWrongWord(null), 450);
  };

  return (
    <div className="question-card">
      <Prompt text="Listen and find" onSpeak={() => speak(`Find the ${target.word}.`)} />

      <p className="listen-hint">
        <span aria-hidden>👂</span>
        <strong>{answered ? target.word : 'Tap the picture you hear'}</strong>
      </p>

      <div className="picture-grid">
        {options.map((word) => {
          const isRight = answered && word.emoji === target.emoji;
          const isHint = !answered && wrongCount >= 2 && word.emoji === target.emoji;
          return (
            <button
              key={word.word}
              type="button"
              className={`picture-card ${wrongWord === word.word ? 'wrong' : ''} ${
                isRight ? 'right' : ''
              } ${isHint ? 'hint' : ''}`}
              onClick={() => choose(word)}
              disabled={answered}
              aria-label={answered ? word.word : 'Picture choice'}
            >
              <span className="picture-emoji" aria-hidden>
                {word.emoji}
              </span>
              <span className="picture-label">{isRight ? word.word : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
