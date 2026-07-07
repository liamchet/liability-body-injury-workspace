import { useMemo, useState } from "react";

const filters = ["הכל", "מיון / אשפוז", "הדמיה", "מומחה", "שיקום", "חוות דעת", "ועדה רפואית"];

export default function MedicalTimeline({ events, onSource, compact = false }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("הכל");
  const [openIds, setOpenIds] = useState(() => new Set([1, 11, 14]));

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const text = `${event.date} ${event.type} ${event.title} ${event.summary} ${event.findings.join(" ")}`.toLowerCase();
      const matchQuery = text.includes(query.toLowerCase());
      const matchFilter = filter === "הכל" || event.type === filter;
      return matchQuery && matchFilter;
    });
  }, [events, query, filter]);

  const toggle = (id) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">רצף רפואי</span>
          <h2>{compact ? "אירועים רפואיים מרכזיים" : "ציר זמן רפואי אינטראקטיבי"}</h2>
        </div>
        {!compact && <span className="badge neutral">{filtered.length} אירועים</span>}
      </div>

      {!compact && (
        <div className="toolbar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש לפי ממצא, תאריך או מקור" />
          <div className="segmented">
            {filters.map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="timeline">
        {filtered.map((event) => {
          const open = openIds.has(event.id) || compact;
          return (
            <article key={event.id} className="timeline-item">
              <button className="timeline-head" onClick={() => toggle(event.id)}>
                <span className="date-pill">{event.date}</span>
                <span className="doc-type">{event.type}</span>
                <strong>{event.title}</strong>
                <span className="chevron">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="timeline-body">
                  <p>{event.summary}</p>
                  <div className="badge-row">
                    {event.findings.map((finding) => <span className="badge info" key={finding}>{finding}</span>)}
                  </div>
                  <div className="item-footer">
                    <span>מקור: {event.source}</span>
                    <button className="ghost-button" onClick={() => onSource({ title: event.source, type: event.type, preview: event.summary })}>
                      פתח מקור
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
