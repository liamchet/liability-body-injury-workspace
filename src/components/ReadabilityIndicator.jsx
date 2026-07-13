export const parseConfidence = (value) => {
  const parsed = Number.parseInt(String(value ?? "").replace("%", ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const readabilityState = (value) => {
  const confidence = parseConfidence(value);
  if (confidence === null) return { confidence, tone: "neutral", label: "קריאות לא ידועה" };
  if (confidence > 85) return { confidence, tone: "success", label: "נקרא בהצלחה" };
  if (confidence >= 60) return { confidence, tone: "warning", label: "קריאות חלקית" };
  return { confidence, tone: "error", label: "קריאות לא מספקת" };
};

export default function ReadabilityIndicator({ value, compact = false, reviewed = false }) {
  const state = readabilityState(value);
  if (state.confidence === null) return null;

  const tooltip = state.tone === "warning"
    ? "קריאות מסמך חלקית — נדרשת בדיקה"
    : state.tone === "error"
      ? "המסמך לא נכלל בסיכום עקב קריאות נמוכה"
      : "המסמך נקרא בהצלחה";

  return (
    <span className={`readability-indicator is-${state.tone} ${compact ? "is-compact" : ""}`} title={tooltip}>
      <span className="readability-dot" aria-hidden="true" />
      {compact && state.tone === "success" ? `${state.confidence}%` : `${state.label} · ${state.confidence}%`}
      {reviewed && <span className="reviewed-mark">נבדק</span>}
    </span>
  );
}
