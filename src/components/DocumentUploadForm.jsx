import { useState } from "react";

const extractedValues = (kind, fileName) => {
  const sourceTitle = fileName.replace(/\.[^.]+$/, "");
  if (kind === "expert") {
    return {
      date: "01/07/2026", name: "ד״ר מומחה לדוגמה", role: "אורתופדיה", disability: "10% צמיתה",
      opinion: "בחוות הדעת תועד ממצא רפואי ונקבעה נכות צמיתה.",
      full: "המערכת חילצה מן המסמך את פרטי המומחה, הממצאים המרכזיים והערכת הנכות. יש לעבור על הנתונים לפני השמירה.",
      breakdown: "פגיעה אורתופדית: 10%", sourceTitle, sourceDate: "01/07/2026",
      sourceContent: "תוכן חוות הדעת חולץ באופן מדומה לצורך הפרוטוטייפ.", sourceType: "חוות דעת רפואית",
    };
  }
  if (kind === "document") {
    return {
      name: sourceTitle, type: "מסמך רפואי", date: "01/07/2026", sourceTitle,
      sourceContent: "תוכן המסמך חולץ באופן מדומה לצורך הפרוטוטייפ.", extraction: "92%",
      aiNotes: "המסמך נקרא בהצלחה והמידע המוצע ממתין לאישור המשתמש.",
    };
  }
  return {
    date: "01/07/2026", title: sourceTitle, summary: "ממצא רפואי מרכזי שחולץ מן המסמך שהועלה.",
    full: "המערכת חילצה באופן מדומה סיכום רפואי מלא מן המסמך. יש לעבור על הנתונים ולתקן אותם לפני השמירה.",
    sourceTitle, sourceDate: "01/07/2026", sourceContent: "תוכן המסמך חולץ באופן מדומה לצורך הפרוטוטייפ.",
    sourceType: "מסמך רפואי",
  };
};

export default function DocumentUploadForm({ kind, title, fields, initialValues, section, onCancel, onSave, onAudit }) {
  const [values, setValues] = useState(initialValues);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));
  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!["application/pdf", "image/png", "image/jpeg"].includes(selectedFile.type)) {
      setError("יש לבחור קובץ PDF, PNG, JPG או JPEG.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(nextPreview);
    setError("");
    setExtracting(true);
    onAudit?.({ action: "העלאת מסמך", section, item: selectedFile.name, field: "קובץ מקור", previousValue: "", newValue: selectedFile.name });
    window.setTimeout(() => {
      const extracted = extractedValues(kind, selectedFile.name);
      setValues((current) => ({ ...current, ...extracted }));
      setExtracting(false);
      onAudit?.({ action: "אישור מידע שחולץ", section, item: selectedFile.name, field: "שדות מסמך", previousValue: "ריק", newValue: "אוכלס אוטומטית" });
    }, 650);
  };

  const save = () => {
    if (!file) {
      setError("יש לבחור מסמך מקור לפני השמירה.");
      return;
    }
    onSave({ ...values, sourcePreviewUrl: previewUrl, sourceFileName: file.name, sourceFileType: file.type });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="edit-modal upload-modal">
        <div className="modal-head compact-head"><h2>{title}</h2><button onClick={onCancel} aria-label="סגור">×</button></div>
        <div className="edit-form">
          <label className="upload-field">
            <span>מסמך מקור</span>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event) => selectFile(event.target.files?.[0])} />
            {file && <small>{file.name}</small>}
          </label>
          {extracting && <div className="extraction-loading"><span className="loading-dot" />מחלץ מידע מהמסמך...</div>}
          {error && <div className="form-error">{error}</div>}
          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea rows={field.rows || 4} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} />
              ) : (
                <input value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} />
              )}
            </label>
          ))}
        </div>
        <div className="edit-actions"><button className="primary-button" onClick={save} disabled={extracting}>שמור</button><button className="ghost-button" onClick={onCancel}>ביטול</button></div>
      </div>
    </div>
  );
}
