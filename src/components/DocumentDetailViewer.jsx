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
          <section className="document-summary-block ai-summary-block">
            <h3>סיכום AI למסמך</h3>
            <p>{document.aiSummary || document.shortSummary || "לא נמצא סיכום AI זמין למסמך זה."}</p>
          </section>

          <section className="document-summary-block">
            <h3>סיכום מורחב / תוכן שחולץ</h3>
            <p>{document.fullSummary || document.aiSummary || "לא נמצא תוכן מורחב זמין למסמך זה."}</p>
          </section>

          {(document.breakdown?.length > 0 || document.totalDisability) && (
            <section className="document-disability-block">
              <h3>פירוט נכות מתוך חוות הדעת</h3>
              {document.breakdown?.length > 0 && (
                <div className="table-wrap">
                  <table className="data-table document-disability-table">
                    <thead><tr><th>תחום / איבר</th><th>אחוז נכות</th><th>סוג הנכות</th><th>הערה קצרה</th></tr></thead>
                    <tbody>{document.breakdown.map((item, index) => (
                      <tr key={`${item.label}-${index}`}>
                        <td>{item.label}</td><td>{item.value}</td><td>{item.type || "—"}</td><td>{item.note || "—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
              {document.totalDisability && <strong className="document-disability-total">סה״כ נכות: {document.totalDisability}</strong>}
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
