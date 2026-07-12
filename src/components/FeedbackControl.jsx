import { useState } from "react";

export default function FeedbackControl() {
  const [mode, setMode] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (saved) return <span className="feedback-saved">הפידבק נשמר</span>;

  return (
    <span className="feedback-control">
      <button className={`feedback-button ${mode === "up" ? "selected" : ""}`} title="מידע טוב" onClick={() => { setMode("up"); setSaved(true); }}>👍</button>
      <button className={`feedback-button ${mode === "down" ? "selected" : ""}`} title="מידע לא טוב" onClick={() => setMode("down")}>👎</button>
      {mode === "down" && (
        <span className="feedback-popover">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="מה לא טוב במידע?" rows="2" />
          <span><button onClick={() => setSaved(true)}>שמור</button><button onClick={() => setMode("")}>ביטול</button></span>
        </span>
      )}
    </span>
  );
}
