import { PULSE_FULL_NAME, PULSE_NAME, pulseLogo } from "./PulseBrand";

export default function ExportActions({ meta, details, event, timeline, experts, matrix, gaps, documents }) {
  const table = (headers, rows) => `<table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell || ""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const matrixHeaders = ["תחום", ...["prediction", "ortho", "neuro", "psych", "rheum", "malal"].map((id) => experts.find((item) => item.id === id)?.expertName || "מומחה")];
  const toDataUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const html = (logoDataUrl) => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${PULSE_NAME} | ${PULSE_FULL_NAME}</title><style>body{font-family:Arial;max-width:1000px;margin:32px auto;line-height:1.6;color:#171746}.brand{padding-bottom:16px;margin-bottom:22px;border-bottom:2px solid #008d99}.brand img{display:block;width:360px;max-width:100%;height:auto;object-fit:contain}h1,h2{color:#020140}h3{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:8px 0 18px}th,td{border:1px solid #ddd;padding:7px;text-align:right;vertical-align:top}th{background:#f1f4f8}.muted{color:#666;font-size:12px}</style></head><body><header class="brand"><img src="${logoDataUrl}" alt="PULSE logo"></header><h1>פרופיל תביעה - ${meta.insuredName}</h1><p><b>תעודת זהות:</b> ${meta.insuredId} | <b>מספר תביעה:</b> ${meta.claimNumber} | <b>פוליסה:</b> ${meta.policyNumber} | <b>תאריך דוח:</b> ${meta.reportDate} | <b>מהות:</b> ${meta.type}</p><h2>פרטים כלליים</h2><ul>${details.map(([label, value]) => `<li><b>${label}:</b> ${value}</li>`).join("")}</ul><h2>נסיבות האירוע</h2><p>${event.text}</p><p class="muted"><b>מקורות:</b> ${event.sources.map((source) => `${source.title} (${source.date})`).join("; ")}</p><h2>סיכום רפואי כרונולוגי</h2>${timeline.map((item) => `<h3>${item.date} - ${item.title}</h3><p>${item.full || item.summary}</p><p class="muted">מקור: ${item.source?.title || ""} ${item.source?.date ? `(${item.source.date})` : ""}</p>`).join("")}<h2>חוות דעת מומחים</h2>${experts.map((item) => `<h3>${item.documentDate} - ${item.expertName} - ${item.medicalField}</h3><p>${item.fullSummary || item.shortSummary}</p>${item.totalDisability ? `<p><b>נכות כוללת:</b> ${item.totalDisability}</p>` : ""}${item.temporaryDisability ? `<p><b>נכות זמנית:</b> ${item.temporaryDisability}</p>` : ""}${item.permanentDisability ? `<p><b>נכות צמיתה:</b> ${item.permanentDisability}</p>` : ""}${item.disabilityBreakdown?.length ? `<ul>${item.disabilityBreakdown.map((part) => `<li>${part.label}: ${part.percentage}</li>`).join("")}</ul>` : ""}<p class="muted">מקור: ${item.source?.title || ""}</p>`).join("")}<h2>טבלת הערכות נכות</h2>${table(matrixHeaders, matrix.map((row) => row.slice(0, matrixHeaders.length)))}<h2>סתירות ופערים</h2>${gaps.map((gap) => `<h3>${gap.topic}</h3><p>${gap.detail}</p><p><b>גורם א׳:</b> ${gap.positionA}<br>${gap.whatA}</p><p><b>גורם ב׳:</b> ${gap.positionB}<br>${gap.whatB}</p>`).join("")}<h2>מסמכים שנקראו</h2>${table(["שם מסמך", "סוג מסמך / כותרת", "תאריך מסמך", "נכלל בסיכום", "מקור", "חילוץ %", "הערות AI על החילוץ"], documents.map((doc) => [doc.name, doc.type, doc.date, doc.included, doc.source?.title || "", doc.extraction, doc.aiNotes]))}<h2>מנגנון המלצה עתידי</h2><p>רכיב זה יוצג באפיק המלצות עתידי ואינו חלק מהגרסה.</p><small>סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות מול המסמכים המקוריים לפני קבלת החלטה.</small></body></html>`;
  const exportHtml = async () => {
    const logoDataUrl = await toDataUrl(pulseLogo);
    const file = new Blob([html(logoDataUrl)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `claim-profile-${meta.claimNumber}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <div className="export-actions"><button className="ghost-button" onClick={exportHtml}>ייצוא HTML</button><button className="primary-button" onClick={() => window.print()}>ייצוא PDF</button></div>;
}
