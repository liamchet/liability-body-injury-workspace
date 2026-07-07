export default function SourceModal({ source, onClose }) {
  if (!source) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="source-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">{source.type}</span>
            <h2>{source.title}</h2>
          </div>
          <button onClick={onClose} aria-label="סגור">×</button>
        </div>
        <div className="mock-preview">
          <p>{source.preview}</p>
          <p className="muted">תצוגת מקור מקוצרת לאבטיפוס. יש לאמת מול המסמך המקורי במערכת התביעות.</p>
        </div>
        <div className="modal-actions">
          <button className="primary-button" onClick={onClose}>סגור</button>
          <button className="ghost-button">סמן לבדיקה</button>
        </div>
      </div>
    </div>
  );
}
