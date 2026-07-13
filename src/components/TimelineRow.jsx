import EditedIndicator from "./EditedIndicator";
import ReadabilityIndicator, { readabilityState } from "./ReadabilityIndicator";

export default function TimelineRow({ date, title, summary, disability, editMetadata, readability, reviewed, onOpen, actions }) {
  const readabilityInfo = readabilityState(readability);
  const partialReadability = readabilityInfo.tone === "warning";
  return (
    <article className={`unified-timeline-row ${partialReadability ? "has-partial-readability" : ""}`}>
      <div className="timeline-row-surface">
        <button className={`timeline-row-main ${disability ? "has-disability" : ""} ${partialReadability ? "is-warning" : ""}`} type="button" onClick={onOpen}>
          <span className="date-pill">{date}</span>
          <span className="timeline-row-title">{title}</span>
          {disability && <strong className="timeline-row-total">{disability}</strong>}
          <span className="row-summary">{summary}</span>
          <span className="timeline-row-status">
            {readability != null && <ReadabilityIndicator value={readability} compact reviewed={reviewed} />}
            <EditedIndicator metadata={editMetadata} compact />
          </span>
          <span className="row-open-hint">פתיחת מסמך</span>
        </button>
        {actions && <div className="row-actions">{actions}</div>}
      </div>
    </article>
  );
}
