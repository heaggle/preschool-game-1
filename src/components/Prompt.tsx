import { IconButton } from './ui';

export function Prompt({ text, onSpeak }: { text: string; onSpeak?: () => void }) {
  return (
    <div className="prompt-row">
      <p className="prompt">{text}</p>
      {onSpeak ? (
        <IconButton label="Say it again" onClick={onSpeak} className="say-btn">
          🔊
        </IconButton>
      ) : null}
    </div>
  );
}
