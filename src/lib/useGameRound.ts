import { useCallback, useState } from 'react';
import { useApp } from '../state/AppContext';

export function useGameRound(total = 5) {
  const { addStars } = useApp();
  const [done, setDone] = useState(0);

  const award = useCallback(() => {
    addStars(1);
    setDone((current) => Math.min(total, current + 1));
  }, [addStars, total]);

  return { done, total, finished: done >= total, award };
}
