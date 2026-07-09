export default function SourceModal({ source, onClose }) {
  if (!source) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="source-modal">
        <div className="modal-head">
          <div>
            <h2>{source.title}</h2>
            <span>תאריך המסמך: <b>{source.date || "לא נמצא במסמכים"}</b></span>
          </div>
          <button onClick={onClose} aria-label="סגור">×</button>
        </div>
        <div className="mock-preview">
          <p>{source.content || "לא נמצא תוכן מלא זמין לתצוגה במסמך זה."}</p>
        </div>
      </div>
    </div>
  );
}
