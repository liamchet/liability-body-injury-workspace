import { useState } from "react";

export default function FeedbackControl() {
  const [mode, setMode] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (saved) return <span className="feedback-saved">הפידבק נשמר</span>;

  return (
    <span className="feedback-control">
      <button className={`feedback-button ${mode === "up" ? "selected" : ""}`} title="מידע טוב" aria-label="מידע טוב" onClick={() => { setMode("up"); setSaved(true); }}>
        <ThumbIcon />
      </button>
      <button className={`feedback-button ${mode === "down" ? "selected" : ""}`} title="מידע לא טוב" aria-label="מידע לא טוב" onClick={() => setMode("down")}>
        <ThumbIcon down />
      </button>
      {mode === "down" && (
        <span className="feedback-popover">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="מה לא טוב במידע?" rows="2" />
          <span><button onClick={() => setSaved(true)}>שמור</button><button onClick={() => setMode("")}>ביטול</button></span>
        </span>
      )}
    </span>
  );
}

function ThumbIcon({ down = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm2 0 4.7-7.1c.7-1 2.3-.6 2.3.7V8h3.7a2.2 2.2 0 0 1 2.1 2.8l-2 7.5A3.5 3.5 0 0 1 16.4 21H9V10Z" transform={down ? "translate(24 24) rotate(180)" : undefined} />
    </svg>
  );
}
