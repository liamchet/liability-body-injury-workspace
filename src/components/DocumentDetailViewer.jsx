import { useEffect } from "react";
import EditedIndicator from "./EditedIndicator";
import ReadabilityIndicator from "./ReadabilityIndicator";

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

  return (
    <div className="modal-backdrop document-viewer-backdrop" role="dialog" aria-modal="true" aria-labelledby="document-viewer-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="document-detail-viewer" dir="rtl">
        <header className="document-viewer-head">
          <div>
            <span className="document-kicker">מסמך מקור</span>
            <h2 id="document-viewer-title">{document.title}</h2>
            <div className="document-viewer-meta">
              <span>תאריך המסמך: <b>{document.date || "לא נמצא במסמכים"}</b></span>
              <ReadabilityIndicator value={document.extractionConfidence} reviewed={document.manuallyReviewed} />
              <EditedIndicator metadata={document.editMetadata} />
            </div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="סגור">×</button>
        </header>

        <div className="document-viewer-scroll">
          <section className="document-summary-block">
            <p>{summary || "לא נמצא סיכום זמין למסמך זה."}</p>
          </section>

          {(document.breakdown?.length > 0 || document.temporaryTotal || document.permanentTotal || document.totalDisability) && (
            <section className="document-disability-block">
              {document.breakdown?.length > 0 && (
                <div className="table-wrap">
                  <table className="data-table document-disability-table">
                    <thead><tr><th>תחום</th><th>תאריך</th><th>אחוז נכות</th></tr></thead>
                    <tbody>{document.breakdown.map((item, index) => (
                      <tr key={`${item.domain || item.label}-${index}`}>
                        <td>{item.domain || item.label}</td><td>{item.date || document.date || "—"}</td><td>{item.percentage || item.value}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
              <div className="document-disability-totals">
                {document.temporaryTotal && <strong className="document-disability-total">נכות זמנית כוללת: {document.temporaryTotal}</strong>}
                {document.permanentTotal && <strong className="document-disability-total">נכות צמיתה כוללת: {document.permanentTotal}</strong>}
                {!document.temporaryTotal && !document.permanentTotal && document.totalDisability && <strong className="document-disability-total">סה״כ נכות: {document.totalDisability}</strong>}
              </div>
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
