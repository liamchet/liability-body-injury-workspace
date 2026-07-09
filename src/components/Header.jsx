import migdalLogo from "../assets/migdal-logo.png";

export default function Header({ meta, productName }) {
  return (
    <header className="top-header">
      <div className="brand-block">
        <img src={migdalLogo} alt="מגדל" />
        <div>
          <div className="eyebrow">Body Injury Claims Workspace</div>
          <h1>{productName}</h1>
        </div>
      </div>
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
