import EditedIndicator from "./EditedIndicator";
import ReadabilityIndicator, { readabilityState } from "./ReadabilityIndicator";

export default function TimelineRow({ date, title, summary, disability, editMetadata, readability, reviewed, onOpen, actions, variant = "medical" }) {
  const readabilityInfo = readabilityState(readability);
  const partialReadability = readabilityInfo.tone === "warning";
  return (
    <article className={`unified-timeline-row is-${variant} ${partialReadability ? "has-partial-readability" : ""}`}>
      <div className="timeline-row-surface">
        <button className={`timeline-row-main ${disability ? "has-disability" : ""} ${partialReadability ? "is-warning" : ""}`} type="button" onClick={onOpen}>
          <span className="date-pill">{date}</span>
          <span className="timeline-row-title">{title}</span>
          <span className="row-summary">{summary}</span>
          {disability && <strong className="timeline-row-total">{disability}</strong>}
          <span className="timeline-row-status">
            {partialReadability && <ReadabilityIndicator value={readability} compact reviewed={reviewed} />}
            <EditedIndicator metadata={editMetadata} compact />
          </span>
        </button>
        {actions && <div className="row-actions">{actions}</div>}
      </div>
    </article>
  );
}
