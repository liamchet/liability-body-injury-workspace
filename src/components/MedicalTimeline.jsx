import { useState } from "react";
import DocumentUploadForm from "./DocumentUploadForm";
import EditModal from "./EditModal";
import TimelineRow from "./TimelineRow";

const fields = [
  { name: "date", label: "תאריך" }, { name: "title", label: "כותרת" },
  { name: "summary", label: "סיכום קצר", type: "textarea", rows: 2 }, { name: "full", label: "סיכום מלא", type: "textarea", rows: 5 },
  { name: "sourceTitle", label: "שם מקור" }, { name: "sourceDate", label: "תאריך מקור" }, { name: "sourceType", label: "סוג מסמך" },
  { name: "sourceContent", label: "תוכן מקור / תיאור מקור", type: "textarea", rows: 3 },
];

const fieldLabels = { date: "תאריך", title: "כותרת", summary: "סיכום קצר", full: "סיכום מלא", sourceTitle: "שם מקור", sourceDate: "תאריך מקור", sourceContent: "תוכן מקור" };

export default function MedicalTimeline({ events, setEvents, onSource, onAudit, getDocumentMeta }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const sortEvents = (items) => [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const saveEvent = (values) => {
    const timestamp = new Date().toLocaleString("he-IL");
    const changedFields = {};
    Object.entries(fieldLabels).forEach(([field, label]) => {
      const previousValue = field.startsWith("source")
        ? editing.source?.[{ sourceTitle: "title", sourceDate: "date", sourceContent: "content" }[field]] || ""
        : editing[field] || "";
      if (String(previousValue) !== String(values[field] || "")) {
        changedFields[field] = { editedBy: "מיישב תביעה", editedAt: timestamp, originalValue: previousValue };
        onAudit?.({ action: "עריכה", section: "סיכום רפואי כרונולוגי", item: editing.title, field: label, previousValue, newValue: values[field] });
      }
    });
    setEvents((items) => sortEvents(items.map((item) => item.id === editing.id ? {
      ...item,
      originalValues: item.originalValues || { date: item.date, title: item.title, summary: item.summary, full: item.full },
      date: values.date, title: values.title, summary: values.summary, full: values.full,
      manuallyEdited: true, editedFields: { ...(item.editedFields || {}), ...changedFields },
      editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp },
      source: { ...item.source, title: values.sourceTitle, date: values.sourceDate || item.source?.date, type: values.sourceType || item.source?.type, content: values.sourceContent || item.source?.content, aiSummary: values.summary, fullSummary: values.sourceContent || values.full },
    } : item)));
    setEditing(null);
  };

  const deleteEvent = (event) => {
    if (window.confirm(`למחוק את "${event.title}"?`)) {
      onAudit?.({ action: "מחיקה", section: "סיכום רפואי כרונולוגי", item: event.title, field: "מסמך רפואי", previousValue: event.summary, newValue: "נמחק" });
      setEvents((items) => items.filter((item) => item.id !== event.id));
    }
  };

  const openEvent = (event) => onSource(event.source, {
    title: event.source?.title || event.title, date: event.source?.date || event.date,
    fullSummary: event.originalSummary || event.summary,
    editMetadata: event.editMetadata, sourcePreviewUrl: event.source?.sourcePreviewUrl, sourceFileType: event.source?.sourceFileType,
  });

  return (
    <section className="panel compact-timeline-panel">
      <div className="section-controls"><button className="text-action" onClick={() => setAdding(true)}>הוסף אירוע / מסמך רפואי</button></div>
      <div className="unified-timeline">
        {events.map((event) => {
          const meta = getDocumentMeta?.(event.source) || {};
          return <TimelineRow key={event.id} date={event.date} title={event.title} summary={event.summary} editMetadata={event.editMetadata} readability={meta.extractionConfidence} reviewed={meta.manuallyReviewed} onOpen={() => openEvent(event)} actions={<>
            <button className="icon-action" title="ערוך" aria-label="ערוך" onClick={() => setEditing(event)}>✎</button>
            <button className="icon-action danger" title="מחק" aria-label="מחק" onClick={() => deleteEvent(event)}>×</button>
          </>} />;
        })}
      </div>
      <div className="bottom-add"><button className="text-action" onClick={() => setAdding(true)}>הוסף אירוע / מסמך רפואי</button></div>

      {editing && <EditModal title="עריכת אירוע רפואי" fields={fields} editedFields={editing.editedFields || {}} initialValues={{ date: editing.date, title: editing.title, summary: editing.summary, full: editing.full || editing.summary, sourceTitle: editing.source?.title || "", sourceDate: editing.source?.date || "", sourceType: editing.source?.type || "", sourceContent: editing.source?.content || "" }} onCancel={() => setEditing(null)} onSave={saveEvent} />}
      {adding && <DocumentUploadForm kind="medical" title="הוספת אירוע רפואי" section="סיכום רפואי כרונולוגי" fields={fields} initialValues={{ date: "", title: "", summary: "", full: "", sourceTitle: "", sourceDate: "", sourceType: "", sourceContent: "" }} onAudit={onAudit} onCancel={() => setAdding(false)} onSave={(values) => {
        const timestamp = new Date().toLocaleString("he-IL");
        const next = { id: Date.now(), date: values.date, title: values.title, summary: values.summary, full: values.full, manuallyEdited: true, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp }, source: { title: values.sourceTitle, date: values.sourceDate, type: values.sourceType || "מסמך מקור", content: values.sourceContent, aiSummary: values.summary, fullSummary: values.full, sourcePreviewUrl: values.sourcePreviewUrl, sourceFileType: values.sourceFileType } };
        setEvents((items) => sortEvents([...items, next]));
        onAudit?.({ action: "הוספה", section: "סיכום רפואי כרונולוגי", item: values.title, field: "מסמך רפואי", previousValue: "", newValue: values.summary });
        setAdding(false);
      }} />}
    </section>
  );
}
