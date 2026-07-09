export default function ReportSection({ id, icon, title, summary, open, onToggle, actions, children }) {
  return (
    <section className={`report-section ${open ? "is-open" : ""}`} id={`section-${id}`}>
      <div className="report-section-head">
        <button className="section-main-button" onClick={() => onToggle(id)} aria-expanded={open}>
          <span className="section-icon" aria-hidden="true">{icon}</span>
          <span className="section-title-block">
            <strong>{title}</strong>
            {summary && <small>: {summary}</small>}
          </span>
        </button>
        {actions && <span className="section-actions">{actions}</span>}
        <button className="section-toggle" onClick={() => onToggle(id)}>{open ? "סגור" : "פתח"}</button>
      </div>
      {open && <div className="report-section-body">{children}</div>}
    </section>
  );
}
