import { useEffect } from "react";
import EditedIndicator from "./EditedIndicator";
import { parseConfidence } from "./ReadabilityIndicator";

export default function DocumentDetailViewer({ document, onClose }) {
  useEffect(() => {
    if (!document) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [document, onClose]);

  if (!document) return null;

  const previews = document.sourcePreviewUrls?.length
    ? document.sourcePreviewUrls
    : document.sourcePreviewUrl
      ? [document.sourcePreviewUrl]
      : [];
  const summary = document.fullSummary || document.aiSummary || document.shortSummary;
  const confidence = parseConfidence(document.extractionConfidence);
  const inclusionLabel = document.inclusionStatus === "full" ? "נכלל במלואו בסיכום" : document.inclusionStatus === "partial" ? "נכלל חלקית בסיכום" : document.inclusionStatus === "excluded" ? "לא נכלל בסיכום" : "סטטוס הכללה לא ידוע";
  const disabilityItems = [
    ...(document.disabilityBreakdown || []).map((item) => `${item.label}: ${item.percentage}`),
    document.temporaryDisability && `נכות זמנית: ${document.temporaryDisability}`,
    document.permanentDisability && (document.temporaryDisability || document.permanentDisability !== document.totalDisability) && `נכות צמיתה: ${document.permanentDisability}`,
    document.totalDisability && `נכות כוללת: ${document.totalDisability}`,
  ].filter(Boolean);

  return (
    <div className="modal-backdrop document-viewer-backdrop" role="dialog" aria-modal="true" aria-labelledby="document-viewer-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="document-detail-viewer" dir="rtl">
        <header className="document-viewer-head">
          <div>
            <span className="document-kicker">מסמך מקור</span>
            <h2 id="document-viewer-title">{document.title}</h2>
            <div className="document-viewer-meta">
              <span>תאריך המסמך: <b>{document.date || "לא נמצא במסמכים"}</b></span>
              <span>רמת קריאות: <b>{confidence == null ? "לא ידועה" : `${confidence}%`}</b></span>
              <span>{inclusionLabel}</span>
              {document.manuallyReviewed && <span>נבדק ידנית</span>}
              <EditedIndicator metadata={document.editMetadata} />
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="סגור">×</button>
        </header>

        <div className="document-viewer-scroll">
          <section className="document-summary-block">
            <p>{summary || "לא נמצא סיכום זמין למסמך זה."}</p>
          </section>

          {disabilityItems.length > 0 && (
            <section className="document-disability-block">
              <h3>קביעות נכות</h3>
              <ul className="document-disability-list">{disabilityItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}

          <section className="document-source-block">
            <h3>מסמך המקור הסרוק</h3>
            {previews.length ? (
              <div className="document-previews">
                {previews.map((preview, index) => {
                  const isPdf = document.sourceFileType === "application/pdf" || /\.pdf(?:$|\?)/i.test(preview);
                  return isPdf ? (
                    <iframe key={preview} src={preview} title={`${document.title} — עמוד ${index + 1}`} />
                  ) : (
                    <a key={preview} href={preview} target="_blank" rel="noreferrer" title="פתיחה בגודל מלא">
                      <img src={preview} alt={`${document.title} — עמוד ${index + 1}`} />
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="source-unavailable">מסמך המקור הסרוק אינו זמין בפרוטוטייפ</div>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
