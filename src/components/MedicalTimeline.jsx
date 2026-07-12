import { useState } from "react";
import EditModal from "./EditModal";
import FeedbackControl from "./FeedbackControl";

export default function MedicalTimeline({ events, setEvents, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const toggle = (id) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  const expandAll = () => setOpenIds(new Set(events.map((event) => event.id)));
  const collapseAll = () => setOpenIds(new Set());
  const sortEvents = (items) => [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const saveEvent = (values) => {
    setEvents((items) => sortEvents(items.map((item) => (
      item.id === editing.id
        ? {
            ...item,
            date: values.date,
            title: values.title,
            summary: values.summary,
            full: values.full,
            source: { ...item.source, title: values.sourceTitle, date: values.sourceDate || item.source.date, content: values.sourceContent || item.source.content },
          }
        : item
    ))));
    setEditing(null);
  };

  const deleteEvent = (event) => {
    if (window.confirm(`למחוק את "${event.title}"?`)) {
      setEvents((items) => items.filter((item) => item.id !== event.id));
    }
  };
  const fields = [
    { name: "date", label: "תאריך" }, { name: "title", label: "כותרת" },
    { name: "summary", label: "סיכום קצר", type: "textarea", rows: 2 }, { name: "full", label: "סיכום מלא", type: "textarea", rows: 5 },
    { name: "sourceTitle", label: "שם מקור" }, { name: "sourceDate", label: "תאריך מקור" }, { name: "sourceContent", label: "תוכן מקור / תיאור מקור", type: "textarea", rows: 3 },
  ];

  return (
    <section className="panel">
      <div className="section-controls">
        <button className="text-control" onClick={expandAll}>הרחב הכל</button>
        <span>|</span>
        <button className="text-control" onClick={collapseAll}>צמצם הכל</button>
        <button className="text-action" onClick={() => setAdding(true)}>הוסף אירוע / מסמך רפואי</button>
      </div>

      <div className="timeline">
        {events.map((event) => {
          const open = openIds.has(event.id);

          return (
            <article key={event.id} className="timeline-item">
              <div className="timeline-head-row">
                <button className="timeline-head" onClick={() => toggle(event.id)} aria-expanded={open}>
                  <span className="date-pill">{event.date}</span>
                  <strong>{event.title}</strong>
                  <span className="row-summary">{event.summary}</span>
                  <span className="chevron">{open ? "−" : "+"}</span>
                </button>
                <div className="row-actions">
                  <button className="icon-action" title="ערוך" aria-label="ערוך" onClick={() => setEditing(event)}>✎</button>
                  <button className="icon-action danger" title="מחק" aria-label="מחק" onClick={() => deleteEvent(event)}>×</button>
                  <FeedbackControl />
                </div>
              </div>

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
      <div className="bottom-add"><button className="text-action" onClick={() => setAdding(true)}>הוסף אירוע / מסמך רפואי</button></div>

      {editing && (
        <EditModal
          title="עריכת אירוע רפואי"
          fields={fields}
          initialValues={{
            date: editing.date,
            title: editing.title,
            summary: editing.summary,
            full: editing.full || editing.summary,
            sourceTitle: editing.source?.title || "",
            sourceDate: editing.source?.date || "",
            sourceContent: editing.source?.content || "",
          }}
          onCancel={() => setEditing(null)}
          onSave={saveEvent}
        />
      )}
      {adding && <EditModal title="הוספת אירוע רפואי" fields={fields} initialValues={{ date: "", title: "", summary: "", full: "", sourceTitle: "", sourceDate: "", sourceContent: "" }} onCancel={() => setAdding(false)} onSave={(values) => { setEvents((items) => sortEvents([...items, { id: Date.now(), date: values.date, title: values.title, summary: values.summary, full: values.full, source: { title: values.sourceTitle, date: values.sourceDate, type: "מסמך מקור", content: values.sourceContent } }])); setAdding(false); }} />}
    </section>
  );
}
