import { useEffect } from "react";
import AuditTrail from "./AuditTrail";

export default function AuditTrailDrawer({ entries, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="drawer-backdrop audit-backdrop" role="dialog" aria-modal="true" aria-label="יומן שינויים" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="side-drawer audit-drawer" dir="rtl">
        <header className="drawer-head">
          <div><span className="drawer-kicker">כלי מערכת</span><h2>יומן שינויים</h2><p>{entries.length} פעולות מתועדות בתיק</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="סגירת יומן שינויים">×</button>
        </header>
        <div className="audit-drawer-body"><AuditTrail entries={entries} /></div>
      </aside>
    </div>
  );
}
