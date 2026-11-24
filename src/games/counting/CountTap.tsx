import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { buildChoices, praise, pick, randInt } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };

const OBJECTS = [
  { emoji: '🍎', name: 'apples' },
  { emoji: '⭐', name: 'stars' },
  { emoji: '🍪', name: 'cookies' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🐥', name: 'chicks' },
  { emoji: '🍓', name: 'strawberries' },
];

export function CountTap({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5);

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <CountQuestion key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function CountQuestion({ onCorrect }: { onCorrect: () => void }) {
  const setup = useMemo(() => {
    const object = pick(OBJECTS);
    const count = randInt(3, 10);
    return { object, count, choices: buildChoices(count, 3, 1) };
  }, []);

  const [tapped, setTapped] = useState<number[]>([]);
  const [ask, setAsk] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const askTimer = useRef<number | null>(null);
  const wrongTimer = useRef<number | null>(null);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak(`Count the ${setup.object.name}. Tap each one.`);
    return () => {
      if (askTimer.current !== null) window.clearTimeout(askTimer.current);
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    };
  }, [setup.object.name]);

  const tapObject = (index: number) => {
    if (ask || answered || tapped.includes(index)) return;

    const next = [...tapped, index];
    setTapped(next);
    speak(String(next.length), { interrupt: false });

    if (next.length === setup.count) {
      askTimer.current = window.setTimeout(() => {
        setAsk(true);
        speak('How many?');
      }, 480);
    }
  };

  const choose = (value: number) => {
    if (!ask || answered) return;

    if (value === setup.count) {
      setAnswered(true);
      setWrongChoice(null);
      playSfx('correct');
      speak(`${setup.count}. ${praise()}`);
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
    <div className="question-card count-card">
      <Prompt
        text={ask ? 'How many?' : 'Count and tap'}
        onSpeak={() =>
          speak(
            ask
              ? 'How many?'
              : `Count the ${setup.object.name}. Tap each one.`,
          )
        }
      />

      <div className="count-tray" aria-label={`${setup.count} objects`}>
        {Array.from({ length: setup.count }, (_, index) => {
          const counted = tapped.includes(index);
          return (
            <button
              key={index}
              type="button"
              className={`count-object ${counted ? 'counted' : ''}`}
              onClick={() => tapObject(index)}
              disabled={counted || ask}
              aria-label={counted ? `Counted` : `Object ${index + 1}`}
            >
              <span aria-hidden>{setup.object.emoji}</span>
              {counted ? <span className="count-check">✓</span> : null}
            </button>
          );
        })}
      </div>

      {ask ? (
        <div className="choice-grid">
          {setup.choices.map((value) => {
            const isRight = answered && value === setup.count;
            const isHint = !answered && wrongCount >= 2 && value === setup.count;
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
      ) : (
        <p className="tap-hint">Tap each one to count.</p>
      )}
    </div>
  );
}
