export function HundredChart({
  target,
  solved,
  wrong,
  hint,
  onPick,
}: {
  target: number;
  solved: number | null;
  wrong: number | null;
  hint: boolean;
  onPick: (value: number) => void;
}) {
  return (
    <div className="hundred-grid" role="grid" aria-label="Numbers from 1 to 100">
      {Array.from({ length: 100 }, (_, index) => {
        const value = index + 1;
        const decade = Math.floor((value - 1) / 10);
        const classes = ['hundred-cell', `decade-${decade % 2}`];
        if (solved === value) classes.push('right');
        if (wrong === value) classes.push('wrong');
        if (hint && value === target) classes.push('hint');
        return (
          <button
            key={value}
            type="button"
            className={classes.join(' ')}
            onClick={() => onPick(value)}
            aria-label={`${value}`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
