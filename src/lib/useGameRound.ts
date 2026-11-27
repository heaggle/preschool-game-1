import { useCallback, useState } from 'react';
import { useApp } from '../state/AppContext';
import type { Domain } from './storage';

export function useGameRound(total = 5, domain?: Domain) {
  const { addStars, recordProgress } = useApp();
  const [done, setDone] = useState(0);

  const award = useCallback(() => {
    addStars(1);
    if (domain) recordProgress(domain, 1);
    setDone((current) => Math.min(total, current + 1));
  }, [addStars, recordProgress, total, domain]);

  return { done, total, finished: done >= total, award };
}
