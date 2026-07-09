export default function ReportSection({ id, number, title, summary, sourceHint, open, onToggle, children }) {
  return (
    <section className={`report-section ${open ? "is-open" : ""}`} id={`section-${id}`}>
      <button className="report-section-head" onClick={() => onToggle(id)} aria-expanded={open}>
        <span className="section-letter">{number}</span>
        <span className="section-title-block">
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
        {sourceHint && <span className="source-hint">{sourceHint}</span>}
        <span className="section-toggle">{open ? "סגור" : "פתח"}</span>
      </button>
      {open && <div className="report-section-body">{children}</div>}
    </section>
  );
}
