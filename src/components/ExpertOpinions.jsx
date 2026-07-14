import { useState } from "react";
import DocumentUploadForm from "./DocumentUploadForm";
import EditModal from "./EditModal";
import TimelineRow from "./TimelineRow";

const fields = [
  { name: "documentDate", label: "תאריך מסמך" }, { name: "expertName", label: "שם מומחה" }, { name: "medicalField", label: "תחום רפואי" },
  { name: "temporaryDisability", label: "נכות זמנית" }, { name: "permanentDisability", label: "נכות צמיתה" }, { name: "netDisability", label: "נטו לאחר חפיפה" }, { name: "totalDisability", label: "נכות כוללת" },
  { name: "shortSummary", label: "סיכום קצר", type: "textarea", rows: 2 }, { name: "fullSummary", label: "סיכום מלא", type: "textarea", rows: 5 },
  { name: "disabilityBreakdown", label: "פירוט אחוזי נכות — רכיב | אחוז", type: "textarea", rows: 3 },
  { name: "sourceTitle", label: "שם מקור" }, { name: "sourceDate", label: "תאריך מקור" }, { name: "sourceType", label: "סוג מסמך" }, { name: "sourceContent", label: "תוכן מקור / תיאור מקור", type: "textarea", rows: 3 },
];

const breakdownText = (expert) => (expert.disabilityBreakdown || []).map((item) => `${item.label} | ${item.percentage}`).join("\n");
const parseBreakdown = (text = "") => text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
  const [label, ...percentageParts] = line.split("|").map((part) => part.trim());
  return { label, percentage: percentageParts.join(" | ") };
}).filter((item) => item.label && item.percentage);

const formatTotals = (expert) => {
  if (expert.temporaryDisability && expert.permanentDisability) return `נכות זמנית: ${expert.temporaryDisability} | נכות צמיתה: ${expert.permanentDisability}`;
  if (expert.permanentDisability && expert.netDisability) return `נכות צמיתה: ${expert.permanentDisability} | נטו: ${expert.netDisability}`;
  if (expert.totalDisability) return `נכות כוללת: ${expert.totalDisability}`;
  if (expert.permanentDisability) return `נכות צמיתה: ${expert.permanentDisability}`;
  if (expert.temporaryDisability) return `נכות זמנית: ${expert.temporaryDisability}`;
  return "";
};

export default function ExpertOpinions({ experts, setExperts, onSource, onAudit, getDocumentMeta }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const valuesFor = (expert) => ({
    documentDate: expert.documentDate, expertName: expert.expertName, medicalField: expert.medicalField,
    temporaryDisability: expert.temporaryDisability || "", permanentDisability: expert.permanentDisability || "", netDisability: expert.netDisability || "", totalDisability: expert.totalDisability || "",
    shortSummary: expert.shortSummary || "", fullSummary: expert.fullSummary || expert.shortSummary || "", disabilityBreakdown: breakdownText(expert),
    sourceTitle: expert.source?.title || "", sourceDate: expert.source?.date || "", sourceType: expert.source?.type || "", sourceContent: expert.source?.content || "",
  });

  const saveExpert = (values) => {
    const timestamp = new Date().toLocaleString("he-IL");
    const previous = valuesFor(editing);
    const changedFields = {};
    Object.keys(previous).forEach((field) => {
      if (String(previous[field] || "") !== String(values[field] || "")) {
        changedFields[field] = { editedBy: "מיישב תביעה", editedAt: timestamp, originalValue: previous[field] };
        onAudit?.({ action: "עריכה", section: "חוות דעת מומחים", item: editing.expertName, field, previousValue: previous[field], newValue: values[field] });
      }
    });
    setExperts((items) => items.map((item) => item.id === editing.id ? {
      ...item, originalValues: item.originalValues || previous,
      documentDate: values.documentDate, expertName: values.expertName, medicalField: values.medicalField,
      temporaryDisability: values.temporaryDisability, permanentDisability: values.permanentDisability, netDisability: values.netDisability, totalDisability: values.totalDisability,
      shortSummary: values.shortSummary, fullSummary: values.fullSummary, disabilityBreakdown: parseBreakdown(values.disabilityBreakdown),
      manuallyEdited: true, editedFields: { ...(item.editedFields || {}), ...changedFields }, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp },
      source: { ...item.source, title: values.sourceTitle, date: values.sourceDate || item.source?.date, type: values.sourceType || item.source?.type, content: values.sourceContent || item.source?.content, aiSummary: values.shortSummary, fullSummary: values.fullSummary },
    } : item));
    setEditing(null);
  };

  const deleteExpert = (expert) => {
    if (window.confirm(`למחוק את חוות הדעת של ${expert.expertName}?`)) {
      onAudit?.({ action: "מחיקה", section: "חוות דעת מומחים", item: expert.expertName, field: "חוות דעת", previousValue: expert.shortSummary, newValue: "נמחק" });
      setExperts((items) => items.filter((item) => item.id !== expert.id));
    }
  };

  const openExpert = (expert) => onSource(expert.source, {
    title: expert.documentTitle || expert.source?.title || `${expert.expertName} – ${expert.medicalField}`,
    date: expert.documentDate, aiSummary: expert.shortSummary, fullSummary: expert.fullSummary,
    disabilityBreakdown: expert.disabilityBreakdown, temporaryDisability: expert.temporaryDisability,
    permanentDisability: expert.permanentDisability, netDisability: expert.netDisability, totalDisability: expert.totalDisability,
    editMetadata: expert.editMetadata, sourcePreviewUrl: expert.source?.sourcePreviewUrl, sourceFileType: expert.source?.sourceFileType,
  });

  return (
    <section className="panel compact-timeline-panel">
      <div className="section-controls"><button className="text-action" onClick={() => setAdding(true)}>הוסף חוות דעת</button></div>
      <div className="unified-timeline expert-timeline">
        {experts.map((expert) => {
          const meta = getDocumentMeta?.(expert.source) || {};
          return <TimelineRow key={expert.id} variant="expert" date={expert.documentDate} title={`${expert.expertName} – ${expert.medicalField}`} disability={formatTotals(expert)} summary={expert.shortSummary} editMetadata={expert.editMetadata} readability={meta.extractionConfidence} reviewed={meta.manuallyReviewed} onOpen={() => openExpert(expert)} actions={<>
            <button className="icon-action" title="ערוך" aria-label="ערוך" onClick={() => setEditing(expert)}>✎</button>
            <button className="icon-action danger" title="מחק" aria-label="מחק" onClick={() => deleteExpert(expert)}>×</button>
          </>} />;
        })}
      </div>
      <div className="bottom-add"><button className="text-action" onClick={() => setAdding(true)}>הוסף חוות דעת</button></div>

      {editing && <EditModal title="עריכת חוות דעת מומחה" fields={fields} editedFields={editing.editedFields || {}} initialValues={valuesFor(editing)} onCancel={() => setEditing(null)} onSave={saveExpert} />}
      {adding && <DocumentUploadForm kind="expert" title="הוספת חוות דעת" section="חוות דעת מומחים" fields={fields} initialValues={{ documentDate: "", expertName: "", medicalField: "", temporaryDisability: "", permanentDisability: "", netDisability: "", totalDisability: "", shortSummary: "", fullSummary: "", disabilityBreakdown: "", sourceTitle: "", sourceDate: "", sourceType: "", sourceContent: "" }} onAudit={onAudit} onCancel={() => setAdding(false)} onSave={(values) => {
        const timestamp = new Date().toLocaleString("he-IL");
        const next = { id: `expert-${Date.now()}`, documentTitle: values.sourceTitle || "חוות דעת רפואית", documentDate: values.documentDate, expertName: values.expertName, medicalField: values.medicalField, temporaryDisability: values.temporaryDisability, permanentDisability: values.permanentDisability, netDisability: values.netDisability, totalDisability: values.totalDisability, shortSummary: values.shortSummary, fullSummary: values.fullSummary, disabilityBreakdown: parseBreakdown(values.disabilityBreakdown), manuallyEdited: true, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp }, source: { title: values.sourceTitle, date: values.sourceDate, type: values.sourceType || "חוות דעת", content: values.sourceContent, aiSummary: values.shortSummary, fullSummary: values.fullSummary, sourcePreviewUrl: values.sourcePreviewUrl, sourceFileType: values.sourceFileType } };
        setExperts((items) => [...items, next]);
        onAudit?.({ action: "הוספה", section: "חוות דעת מומחים", item: values.expertName, field: "חוות דעת", previousValue: "", newValue: values.shortSummary });
        setAdding(false);
      }} />}
    </section>
  );
}
