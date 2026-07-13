export default function EditedIndicator({ metadata, compact = false }) {
  if (!metadata) return null;

  const editedBy = metadata.editedBy || metadata.user || "מיישב תביעה";
  const editedAt = metadata.editedAt || metadata.timestamp;
  const tooltip = `נערך ידנית על ידי ${editedBy}${editedAt ? ` בתאריך ${editedAt}` : ""}`;

  return (
    <span className={`edited-indicator ${compact ? "is-compact" : ""}`} title={tooltip}>
      <span aria-hidden="true">✎</span>
      נערך ידנית
    </span>
  );
}
