import EditedIndicator from "./EditedIndicator";
import ReadabilityIndicator from "./ReadabilityIndicator";

export default function TimelineRow({ date, title, summary, disability, editMetadata, readability, reviewed, onOpen, actions }) {
  return (
    <article className="unified-timeline-row">
      <div className="timeline-row-surface">
        <button className={`timeline-row-main ${disability ? "has-disability" : ""}`} type="button" onClick={onOpen}>
          <span className="date-pill">{date}</span>
          <span className="timeline-row-title">{title}</span>
          {disability && <strong className="timeline-row-total">סה״כ נכות: {disability}</strong>}
          <span className="row-summary">{summary}</span>
          <span className="row-open-hint">פתיחת מסמך</span>
        </button>
        {actions && <div className="row-actions">{actions}</div>}
      </div>
      <div className="timeline-row-indicators">
        {readability != null && Number.parseInt(String(readability), 10) <= 85 && (
          <ReadabilityIndicator value={readability} compact reviewed={reviewed} />
        )}
        <EditedIndicator metadata={editMetadata} compact />
      </div>
    </article>
  );
}
