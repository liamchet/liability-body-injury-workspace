import { useState } from "react";
import DocumentUploadForm from "./DocumentUploadForm";
import ReadabilityIndicator, { readabilityState } from "./ReadabilityIndicator";

const fields = [
  { name: "name", label: "שם מסמך" }, { name: "type", label: "סוג מסמך" }, { name: "date", label: "תאריך מסמך" },
  { name: "sourceTitle", label: "שם מקור" }, { name: "sourceContent", label: "תוכן / סיכום מורחב", type: "textarea", rows: 4 },
  { name: "extraction", label: "אחוז קריאות" }, { name: "aiNotes", label: "הערות AI", type: "textarea", rows: 3 },
];

export default function DocumentsPanel({ documents, setDocuments, onSource, onAudit, onApprove }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="panel documents-panel">
      <div className="section-controls"><button className="text-action" onClick={() => setAdding(true)}>הוסף מסמך</button></div>
      <div className="table-wrap">
        <table className="data-table documents-table">
          <thead><tr><th>שם מסמך</th><th>סוג</th><th>תאריך</th><th>נכלל בסיכום</th><th>מקור</th><th>קריאות</th><th>הערות AI</th><th>סטטוס בדיקה</th></tr></thead>
          <tbody>{documents.map((doc) => {
            const state = readabilityState(doc.extraction);
            const excluded = state.tone === "error";
            return (
              <tr key={doc.id} className={`document-row is-${state.tone}`}>
                <td><strong>{doc.name}</strong>{excluded && <small className="low-readability-note">לא נכלל בסיכום עקב קריאות נמוכה</small>}</td>
                <td>{doc.type}</td><td>{doc.date}</td><td>{excluded ? "לא" : doc.included}</td>
                <td><button className="source-link" onClick={() => onSource(doc.source, { documentId: doc.id, title: doc.name, date: doc.date, fullSummary: doc.source?.content, extractionConfidence: doc.extraction, manuallyReviewed: doc.manuallyReviewed, reviewMetadata: doc.reviewMetadata })}>{doc.source?.title || doc.name}</button></td>
                <td><ReadabilityIndicator value={doc.extraction} reviewed={doc.manuallyReviewed} /></td>
                <td>{doc.aiNotes}</td>
                <td>{state.tone === "warning" ? (doc.manuallyReviewed ? <span className="review-status">נבדק ידנית על ידי {doc.reviewMetadata?.reviewedBy}<small>{doc.reviewMetadata?.reviewedAt}</small></span> : <button className="manual-review-button" onClick={() => onApprove?.(doc.id)}>אשר קריאה ידנית</button>) : state.tone === "error" ? <span className="review-status is-error">נדרשת בדיקה נפרדת</span> : <span className="review-status is-success">נקרא בהצלחה</span>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      {adding && <DocumentUploadForm kind="document" title="הוספת מסמך" section="מסמכים שנקראו" fields={fields} initialValues={{ name: "", type: "", date: "", sourceTitle: "", sourceContent: "", extraction: "", aiNotes: "" }} onAudit={onAudit} onCancel={() => setAdding(false)} onSave={(values) => {
        const next = { id: `document-${Date.now()}`, name: values.name, type: values.type, date: values.date, included: Number.parseInt(values.extraction, 10) >= 60 ? "כן" : "לא", extraction: values.extraction, aiNotes: values.aiNotes, source: { title: values.sourceTitle, date: values.date, type: values.type, content: values.sourceContent, aiSummary: values.aiNotes, fullSummary: values.sourceContent, sourcePreviewUrl: values.sourcePreviewUrl, sourceFileType: values.sourceFileType } };
        setDocuments((items) => [...items, next]);
        onAudit?.({ action: "הוספה", section: "מסמכים שנקראו", item: values.name, field: "מסמך", previousValue: "", newValue: values.aiNotes });
        setAdding(false);
      }} />}
    </section>
  );
}
