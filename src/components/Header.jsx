export default function Header({ meta, productName }) {
  return (
    <header className="top-header">
      <div className="brand-block">
        <div className="eyebrow">Body Injury Claims Workspace</div>
        <h1>{productName}</h1>
      </div>
      <div className="case-strip">
        <Meta label="סטטוס" value={meta.status} strong />
        <Meta label="תביעה" value={meta.claimNumber} />
        <Meta label="פוליסה" value={meta.policyNumber} />
        <Meta label="תאונה" value={meta.accidentDate} />
        <Meta label="סוג תיק" value={meta.type} />
        <Meta label="עדכון AI" value={meta.lastAiUpdate} />
        <span className="badge success">{meta.aiStatus}</span>
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
