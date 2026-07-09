export default function ReportSection({ id, icon, title, summary, open, onToggle, children }) {
  return (
    <section className={`report-section ${open ? "is-open" : ""}`} id={`section-${id}`}>
      <button className="report-section-head" onClick={() => onToggle(id)} aria-expanded={open}>
        <span className="section-icon" aria-hidden="true">{icon}</span>
        <span className="section-title-block">
          <strong>{title}</strong>
          {summary && <small>: {summary}</small>}
        </span>
        <span className="section-toggle">{open ? "סגור" : "פתח"}</span>
      </button>
      {open && <div className="report-section-body">{children}</div>}
    </section>
  );
}
