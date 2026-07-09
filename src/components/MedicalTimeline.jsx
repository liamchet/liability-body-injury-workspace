import { useState } from "react";

export default function MedicalTimeline({ events, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set([1, 2]));

  const toggle = (id) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  const expandAll = () => setOpenIds(new Set(events.map((event) => event.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <section className="panel">
      <div className="section-controls">
        <button className="ghost-button" onClick={expandAll}>הרחב הכל</button>
        <button className="ghost-button" onClick={collapseAll}>צמצם הכל</button>
      </div>

      <div className="timeline">
        {events.map((event) => {
          const open = openIds.has(event.id);
          const source = {
            title: event.source,
            date: event.date,
            type: event.type,
            section: "סיכום רפואי כרונולוגי",
            preview: event.summary,
          };

          return (
            <article key={event.id} className="timeline-item">
              <div className="timeline-head-row">
                <button className="timeline-head" onClick={() => toggle(event.id)} aria-expanded={open}>
                  <span className="date-pill">{event.date}</span>
                  <strong>{event.title}</strong>
                  <span className="row-summary">{event.summary}</span>
                  <span className="chevron">{open ? "−" : "+"}</span>
                </button>
                <button className="source-link compact" onClick={() => onSource(source)}>
                  פתח מקור
                </button>
              </div>

              {open && (
                <div className="timeline-body">
                  <p>{event.summary}</p>
                  {event.findings?.length > 0 && (
                    <div className="findings-list">
                      <strong>ממצאים מרכזיים:</strong>
                      <span>{event.findings.join(" · ")}</span>
                    </div>
                  )}
                  <div className="item-footer">
                    <span>מסמך מקור: {event.source}</span>
                    <button className="ghost-button" onClick={() => onSource(source)}>
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
