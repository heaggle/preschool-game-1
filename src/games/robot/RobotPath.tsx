import { useEffect, useMemo, useRef, useState } from 'react';
import { GameBox } from '../../components/GameBox';
import { Prompt } from '../../components/Prompt';
import { playSfx, speak } from '../../lib/audio';
import { praise, randInt } from '../../lib/random';
import { useAdvance } from '../../lib/useAdvance';
import { useGameRound } from '../../lib/useGameRound';

type GameProps = { onAgain: () => void; onHome: () => void };
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID = 4;
const CELLS = GRID * GRID;
const MAX_MOVES = 8;

const ARROW: Record<Direction, string> = { up: '↑', down: '↓', left: '←', right: '→' };

function move(from: number, dir: Direction): number | null {
  const row = Math.floor(from / GRID);
  const col = from % GRID;
  switch (dir) {
    case 'up':
      return row > 0 ? from - GRID : null;
    case 'down':
      return row < GRID - 1 ? from + GRID : null;
    case 'left':
      return col > 0 ? from - 1 : null;
    case 'right':
      return col < GRID - 1 ? from + 1 : null;
  }
}

export function RobotPath({ onAgain, onHome }: GameProps) {
  const round = useGameRound(5, 'robot');

  return (
    <GameBox done={round.done} onAgain={onAgain} onHome={onHome}>
      <RobotBoard key={round.done} onCorrect={round.award} />
    </GameBox>
  );
}

function RobotBoard({ onCorrect }: { onCorrect: () => void }) {
  const setup = useMemo(() => {
    const start = 0;
    let target = randInt(1, CELLS - 1);
    while (target === start) target = randInt(1, CELLS - 1);
    return { start, target };
  }, []);

  const [program, setProgram] = useState<Direction[]>([]);
  const [robotPos, setRobotPos] = useState<number>(setup.start);
  const [phase, setPhase] = useState<'building' | 'running' | 'success' | 'failed'>('building');
  const timers = useRef<number[]>([]);
  const advance = useAdvance(onCorrect);

  useEffect(() => {
    speak('Guide the robot to the star. Tap the arrows, then press Go.');
    return () => timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const addMove = (dir: Direction) => {
    if (phase !== 'building') return;
    setProgram((current) => (current.length >= MAX_MOVES ? current : [...current, dir]));
    playSfx('click');
  };

  const undo = () => {
    if (phase !== 'building') return;
    setProgram((current) => current.slice(0, -1));
    playSfx('click');
  };

  const reset = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setProgram([]);
    setRobotPos(setup.start);
    setPhase('building');
  };

  const run = () => {
    if (phase !== 'building' || program.length === 0) return;
    setPhase('running');
    let pos = setup.start;
    setRobotPos(pos);
    let index = 0;

    const step = () => {
      if (index >= program.length) {
        if (pos === setup.target) {
          setPhase('success');
          playSfx('win');
          speak(praise());
          advance(1600);
        } else {
          setPhase('failed');
          playSfx('error');
          speak('Not there yet. Try again.');
        }
        return;
      }

      const next = move(pos, program[index]);
      if (next === null) {
        setPhase('failed');
        playSfx('error');
        speak('Oops, a wall! Try another way.');
        return;
      }

      pos = next;
      index += 1;
      setRobotPos(pos);
      playSfx('pop');
      timers.current.push(window.setTimeout(step, 520));
    };

    step();
  };

  return (
    <div className="question-card robot-card">
      <Prompt
        text="Guide the robot to the star"
        onSpeak={() => speak('Guide the robot to the star. Tap the arrows, then press Go.')}
      />

      <div className="robot-grid" role="grid" aria-label="Robot grid">
        {Array.from({ length: CELLS }, (_, cell) => {
          const isRobot = robotPos === cell;
          const isTarget = setup.target === cell;
          return (
            <div key={cell} className={`robot-cell ${isTarget ? 'target' : ''}`}>
              {isRobot ? (
                <span className="robot-token" aria-hidden>
                  🤖
                </span>
              ) : isTarget ? (
                <span aria-hidden>⭐</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="robot-program" aria-label="Your instructions">
        {program.length === 0 ? (
          <span className="program-empty">Tap the arrows to build a path</span>
        ) : (
          program.map((dir, index) => (
            <span key={index} className="program-arrow" aria-hidden>
              {ARROW[dir]}
            </span>
          ))
        )}
      </div>

      <div className="robot-controls">
        <div className="dpad">
          <button
            type="button"
            className="dpad-btn up"
            onClick={() => addMove('up')}
            disabled={phase !== 'building'}
            aria-label="Up"
          >
            ↑
          </button>
          <button
            type="button"
            className="dpad-btn left"
            onClick={() => addMove('left')}
            disabled={phase !== 'building'}
            aria-label="Left"
          >
            ←
          </button>
          <button
            type="button"
            className="dpad-btn down"
            onClick={() => addMove('down')}
            disabled={phase !== 'building'}
            aria-label="Down"
          >
            ↓
          </button>
          <button
            type="button"
            className="dpad-btn right"
            onClick={() => addMove('right')}
            disabled={phase !== 'building'}
            aria-label="Right"
          >
            →
          </button>
        </div>

        <div className="robot-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={undo}
            disabled={phase !== 'building' || program.length === 0}
          >
            ↩️ Undo
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={run}
            disabled={phase !== 'building' || program.length === 0}
          >
            ▶️ Go
          </button>
        </div>

        {phase === 'failed' ? (
          <button type="button" className="btn btn-mint" onClick={reset}>
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
