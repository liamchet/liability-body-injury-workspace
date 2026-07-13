import { useState } from "react";
import DocumentUploadForm from "./DocumentUploadForm";
import EditModal from "./EditModal";
import TimelineRow from "./TimelineRow";

const fields = [
  { name: "date", label: "תאריך" }, { name: "name", label: "שם מומחה" }, { name: "role", label: "תחום" }, { name: "temporaryTotal", label: "נכות זמנית כוללת" }, { name: "permanentTotal", label: "נכות צמיתה כוללת" },
  { name: "opinion", label: "סיכום קצר", type: "textarea", rows: 2 }, { name: "full", label: "סיכום מלא", type: "textarea", rows: 5 }, { name: "breakdown", label: "פירוט אחוזי נכות", type: "textarea", rows: 3 },
  { name: "sourceTitle", label: "שם מקור" }, { name: "sourceDate", label: "תאריך מקור" }, { name: "sourceType", label: "סוג מסמך" }, { name: "sourceContent", label: "תוכן מקור / תיאור מקור", type: "textarea", rows: 3 },
];

const breakdownText = (expert) => (expert.breakdown || []).map((item) => `${item.domain || item.label} | ${item.date || expert.date || ""} | ${item.percentage || item.value}`).join("\n");
const parseBreakdown = (text = "", fallbackDate = "") => text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length >= 3) return { domain: parts[0], date: parts[1], percentage: parts.slice(2).join(" | ") };
  const [domain, ...percentageParts] = line.split(":");
  return { domain: domain.trim(), date: fallbackDate, percentage: percentageParts.join(":").trim() };
}).filter((item) => item.domain && item.percentage);

const formatTotals = (expert) => [
  expert.temporaryTotal && `נכות זמנית: ${expert.temporaryTotal}`,
  expert.permanentTotal && `נכות צמיתה: ${expert.permanentTotal}`,
].filter(Boolean).join(" | ");

export default function ExpertOpinions({ experts, setExperts, onSource, onAudit, getDocumentMeta }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const saveExpert = (values) => {
    const timestamp = new Date().toLocaleString("he-IL");
    const previous = { date: editing.date, name: editing.name, role: editing.role, temporaryTotal: editing.temporaryTotal, permanentTotal: editing.permanentTotal, opinion: editing.opinion, full: editing.full, breakdown: breakdownText(editing), sourceTitle: editing.source?.title, sourceDate: editing.source?.date, sourceContent: editing.source?.content };
    const changedFields = {};
    Object.keys(previous).forEach((field) => {
      if (String(previous[field] || "") !== String(values[field] || "")) {
        changedFields[field] = { editedBy: "מיישב תביעה", editedAt: timestamp, originalValue: previous[field] };
        onAudit?.({ action: "עריכה", section: "חוות דעת מומחים", item: editing.name, field, previousValue: previous[field], newValue: values[field] });
      }
    });
    setExperts((items) => items.map((item) => item.id === editing.id ? {
      ...item, originalValues: item.originalValues || previous, date: values.date, name: values.name, role: values.role, temporaryTotal: values.temporaryTotal, permanentTotal: values.permanentTotal, opinion: values.opinion, full: values.full,
      breakdown: parseBreakdown(values.breakdown, values.date), manuallyEdited: true, editedFields: { ...(item.editedFields || {}), ...changedFields }, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp },
      source: { ...item.source, title: values.sourceTitle, date: values.sourceDate || item.source?.date, type: values.sourceType || item.source?.type, content: values.sourceContent || item.source?.content, aiSummary: values.opinion, fullSummary: values.full },
    } : item));
    setEditing(null);
  };

  const deleteExpert = (expert) => {
    if (window.confirm(`למחוק את חוות הדעת של ${expert.name}?`)) {
      onAudit?.({ action: "מחיקה", section: "חוות דעת מומחים", item: expert.name, field: "חוות דעת", previousValue: expert.opinion, newValue: "נמחק" });
      setExperts((items) => items.filter((item) => item.id !== expert.id));
    }
  };

  const openExpert = (expert) => onSource(expert.source, {
    title: expert.source?.title || `${expert.name} – ${expert.role}`, date: expert.date,
    aiSummary: expert.opinion, fullSummary: expert.full, breakdown: expert.breakdown, temporaryTotal: expert.temporaryTotal, permanentTotal: expert.permanentTotal,
    editMetadata: expert.editMetadata, sourcePreviewUrl: expert.source?.sourcePreviewUrl, sourceFileType: expert.source?.sourceFileType,
  });

  return (
    <section className="panel compact-timeline-panel">
      <div className="section-controls"><button className="text-action" onClick={() => setAdding(true)}>הוסף חוות דעת</button></div>
      <div className="unified-timeline expert-timeline">
        {experts.map((expert) => {
          const meta = getDocumentMeta?.(expert.source) || {};
          return <TimelineRow key={expert.id} date={expert.date} title={`${expert.name} – ${expert.role}`} disability={formatTotals(expert)} summary={expert.opinion} editMetadata={expert.editMetadata} readability={meta.extractionConfidence} reviewed={meta.manuallyReviewed} onOpen={() => openExpert(expert)} actions={<>
            <button className="icon-action" title="ערוך" aria-label="ערוך" onClick={() => setEditing(expert)}>✎</button>
            <button className="icon-action danger" title="מחק" aria-label="מחק" onClick={() => deleteExpert(expert)}>×</button>
          </>} />;
        })}
      </div>
      <div className="bottom-add"><button className="text-action" onClick={() => setAdding(true)}>הוסף חוות דעת</button></div>

      {editing && <EditModal title="עריכת חוות דעת מומחה" fields={fields} editedFields={editing.editedFields || {}} initialValues={{ date: editing.date, name: editing.name, role: editing.role, temporaryTotal: editing.temporaryTotal || "", permanentTotal: editing.permanentTotal || "", opinion: editing.opinion || "", full: editing.full || editing.opinion || "", breakdown: breakdownText(editing), sourceTitle: editing.source?.title || "", sourceDate: editing.source?.date || "", sourceType: editing.source?.type || "", sourceContent: editing.source?.content || "" }} onCancel={() => setEditing(null)} onSave={saveExpert} />}
      {adding && <DocumentUploadForm kind="expert" title="הוספת חוות דעת" section="חוות דעת מומחים" fields={fields} initialValues={{ date: "", name: "", role: "", temporaryTotal: "", permanentTotal: "", opinion: "", full: "", breakdown: "", sourceTitle: "", sourceDate: "", sourceType: "", sourceContent: "" }} onAudit={onAudit} onCancel={() => setAdding(false)} onSave={(values) => {
        const timestamp = new Date().toLocaleString("he-IL");
        const next = { id: `expert-${Date.now()}`, date: values.date, name: values.name, role: values.role, temporaryTotal: values.temporaryTotal, permanentTotal: values.permanentTotal, opinion: values.opinion, full: values.full, breakdown: parseBreakdown(values.breakdown, values.date), manuallyEdited: true, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp }, source: { title: values.sourceTitle, date: values.sourceDate, type: values.sourceType || "חוות דעת", content: values.sourceContent, aiSummary: values.opinion, fullSummary: values.full, sourcePreviewUrl: values.sourcePreviewUrl, sourceFileType: values.sourceFileType } };
        setExperts((items) => [...items, next]);
        onAudit?.({ action: "הוספה", section: "חוות דעת מומחים", item: values.name, field: "חוות דעת", previousValue: "", newValue: values.opinion });
        setAdding(false);
      }} />}
    </section>
  );
}
