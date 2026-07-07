export default function ReportSection({ id, letter, title, summary, open, onToggle, children }) {
  return (
    <section className={`report-section ${open ? "is-open" : ""}`} id={`section-${id}`}>
      <button className="report-section-head" onClick={() => onToggle(id)} aria-expanded={open}>
        <span className="section-letter">{letter}</span>
        <span className="section-title-block">
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
        <span className="section-toggle">{open ? "סגור" : "פתח"}</span>
      </button>
      {open && <div className="report-section-body">{children}</div>}
    </section>
  );
}
