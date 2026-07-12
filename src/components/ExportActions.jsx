export default function ExportActions({ meta, details, event, timeline, experts, matrix, gaps, documents }) {
  const html = () => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>פרופיל תביעה</title><style>body{font-family:Arial;max-width:900px;margin:32px auto;line-height:1.6;color:#171746}h1,h2{color:#020140}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:7px;text-align:right}</style></head><body><h1>פרופיל תביעה - ${meta.insuredName}</h1><p>מספר תביעה: ${meta.claimNumber} | פוליסה: ${meta.policyNumber}</p><h2>פרטים כלליים</h2><ul>${details.map(([label, value]) => `<li><b>${label}:</b> ${value}</li>`).join("")}</ul><h2>נסיבות האירוע</h2><p>${event.text}</p><h2>סיכום רפואי כרונולוגי</h2>${timeline.map((item) => `<h3>${item.date} - ${item.title}</h3><p>${item.full || item.summary}</p>`).join("")}<h2>חוות דעת מומחים</h2>${experts.map((item) => `<h3>${item.name} - ${item.role}</h3><p>${item.full || item.opinion}</p><p>${item.disability || ""}</p>`).join("")}<h2>טבלת הערכות נכות</h2><table>${matrix.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table><h2>סתירות ופערים</h2>${gaps.map((gap) => `<h3>${gap.topic}</h3><p>${gap.detail}</p>`).join("")}<h2>מסמכים שנקראו</h2><ul>${documents.map((doc) => `<li>${doc.name}</li>`).join("")}</ul><small>סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות.</small></body></html>`;
  const exportHtml = () => {
    const file = new Blob([html()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `claim-profile-${meta.claimNumber}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <div className="export-actions"><button className="ghost-button" onClick={exportHtml}>ייצוא HTML</button><button className="primary-button" onClick={() => window.print()}>ייצוא PDF</button></div>;
}
