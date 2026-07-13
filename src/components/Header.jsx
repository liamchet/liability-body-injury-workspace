import { useState } from "react";
import PulseBrand from "./PulseBrand";

export default function Header({ meta, onOpenAudit, auditCount }) {
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState(false);

  return (
    <header className="top-header">
      <div className="brand-block">
        <PulseBrand />
        <button className="header-audit-action" type="button" onClick={onOpenAudit} title="פתיחת יומן שינויים">
          <span aria-hidden="true">◷</span> יומן שינויים{auditCount ? <b>{auditCount}</b> : null}
        </button>
      </div>
      <form className="case-lookup" onSubmit={(event) => { event.preventDefault(); setFound(true); }}>
        <input value={lookup} onChange={(event) => { setLookup(event.target.value); setFound(false); }} placeholder="הזן ת״ז / מספר תביעה / פוליסה" />
        <button type="submit">איתור</button>
        {found && <small>התיק זוהה</small>}
      </form>
      <div className="case-strip">
        <Meta label="שם מבוטח" value={meta.insuredName} strong />
        <Meta label="תעודת זהות מבוטח" value={meta.insuredId} />
        <Meta label="תאריך הפקת הדוח" value={meta.reportDate} />
        <Meta label="מספר תביעה" value={meta.claimNumber} />
        <Meta label="מספר פוליסה" value={meta.policyNumber} />
        <Meta label="מהות התביעה" value={meta.type} />
      </div>
    </header>
  );
}

function Meta({ label, value, strong }) {
  return (
    <span className="meta-item">
      <small>{label}</small>
      <b className={strong ? "status-dot" : ""}>{value}</b>
    </span>
  );
}
