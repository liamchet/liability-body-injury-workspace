import { useState } from "react";

export default function MedicalTimeline({ events, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set());

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
        <button className="text-control" onClick={expandAll}>הרחב הכל</button>
        <span>|</span>
        <button className="text-control" onClick={collapseAll}>צמצם הכל</button>
      </div>

      <div className="timeline">
        {events.map((event) => {
          const open = openIds.has(event.id);

          return (
            <article key={event.id} className="timeline-item">
              <button className="timeline-head" onClick={() => toggle(event.id)} aria-expanded={open}>
                <span className="date-pill">{event.date}</span>
                <strong>{event.title}</strong>
                <span className="row-summary">{event.summary}</span>
                <span className="chevron">{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="timeline-body">
                  <p>{event.full || event.summary}</p>
                  <div className="item-footer">
                    <span>מקור:</span>
                    <button className="source-link" onClick={() => onSource(event.source)}>
                      {event.source.title}
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
