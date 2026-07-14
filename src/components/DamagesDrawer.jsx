import { useEffect, useState } from "react";
import { pulseLogo } from "./PulseBrand";

const STORAGE_KEY = "pulse-manual-damages-v1";

const damageRows = [
  ["עבר", "אובדן הכנסה / הפסדי שכר עבר"], ["עבר", "הפסדי פנסיה עבר"], ["עבר", "עזרת צד ג׳ עבר"], ["עבר", "ניידות עבר"], ["עבר", "הוצאות רפואיות עבר"], ["עבר", "הוצאות אחרות עבר"],
  ["עתיד", "אובדן כושר השתכרות / הפסדי שכר עתיד"], ["עתיד", "הפסדי פנסיה עתיד"], ["עתיד", "עזרת צד ג׳ עתיד"], ["עתיד", "ניידות עתיד"], ["עתיד", "הוצאות רפואיות עתיד"], ["עתיד", "דיור"], ["עתיד", "שכר אפוטרופוס"], ["עתיד", "אביזרים"], ["עתיד", "כביסה, מחשב, מזגנים והוצאות נלוות"], ["עתיד", "כאב וסבל"], ["עתיד", "ראש נזק אחר"],
  ["סיכום", "סיכום ביניים"], ["ניכויים", "ניכוי אשם תורם / אחריות", true], ["ניכויים", "ניכוי מל״ל"], ["ניכויים", "ניכוי מיטיב"], ["ניכויים", "ניכוי תשלום תכוף"], ["סיכום", "סכום לאחר ניכויים"], ["סיכום", "שכר טרחה", true], ["סיכום", "מע״מ", true], ["סיכום", "סכום כולל"],
  ["הצעות", "חלק החברה / חלקנו"], ["הצעות", "הצעת תובע"], ["הצעות", "הצעת נתבע"], ["הצעות", "הצעת מגשר"], ["הצעות", "הערות וסיכום התיק"],
].map(([group, label, hasRate]) => ({ group, label, hasRate }));

const groupLabels = { עבר: "נזקי עבר", עתיד: "נזקי עתיד", סיכום: "סיכומים", ניכויים: "ניכויים", הצעות: "הצעות והערות" };
const groups = Object.keys(groupLabels);
const emptyValues = () => Object.fromEntries(damageRows.map((row) => [row.label, { details: "", calculation: "", amount: "", notes: "", rate: "" }]));
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
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

const damagesHtml = (meta, values, logoDataUrl) => {
  const rows = groups.map((group) => `<section><h2>${groupLabels[group]}</h2>${damageRows.filter((row) => row.group === group).map((row) => {
    const value = values[row.label] || {};
    return `<article class="damage-row ${group === "סיכום" ? "is-total" : ""}"><h3>${escapeHtml(row.label)}</h3><dl><div><dt>פרטים</dt><dd>${escapeHtml(value.details) || "—"}</dd></div><div><dt>פירוט החישוב</dt><dd>${escapeHtml(value.calculation) || "—"}</dd></div>${row.hasRate ? `<div><dt>שיעור</dt><dd>${escapeHtml(value.rate) || "—"}</dd></div>` : ""}<div class="amount"><dt>סכום</dt><dd>${escapeHtml(value.amount) || "—"}</dd></div><div><dt>הערות</dt><dd>${escapeHtml(value.notes) || "—"}</dd></div></dl></article>`;
  }).join("")}</section>`).join("");
  const exportedAt = new Date().toLocaleString("he-IL");
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>תחשיב נזק</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#171746;direction:rtl}.brand{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:3px solid #008d99}.brand img{width:250px;max-width:45%;height:auto}.brand h1{margin:0;font-size:28px}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 18px}.meta div{padding:8px;border:1px solid #dce3ec;border-radius:6px}.meta small{display:block;color:#68758a}.meta strong{display:block;margin-top:3px}section{margin:0 0 18px}section>h2{margin:0 0 7px;padding:6px 9px;color:#fff;background:#020140;font-size:15px}.damage-row{break-inside:avoid;margin-bottom:6px;padding:8px 10px;border:1px solid #dce3ec;border-radius:5px}.damage-row.is-total{border-color:#8fdc8d;background:#f3fbf2}.damage-row h3{margin:0 0 6px;font-size:13px}.damage-row dl{display:grid;grid-template-columns:1.1fr 1.4fr .7fr 1fr;gap:6px;margin:0}.damage-row dl div{min-width:0}.damage-row dt{color:#68758a;font-size:10px;font-weight:bold}.damage-row dd{min-height:18px;margin:2px 0 0;overflow-wrap:anywhere;font-size:12px}.damage-row .amount dd{font-weight:bold;direction:ltr;text-align:right}.footer{margin-top:18px;padding-top:8px;border-top:1px solid #dce3ec;color:#68758a;font-size:10px}@media(max-width:700px){.meta{grid-template-columns:1fr}.damage-row dl{grid-template-columns:1fr 1fr}}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.damage-row{page-break-inside:avoid}}</style></head><body><header class="brand"><h1>תחשיב נזק</h1><img src="${logoDataUrl}" alt="PULSE"></header><div class="meta"><div><small>שם התובעת</small><strong>${escapeHtml(meta.insuredName)}</strong></div><div><small>מספר תביעה</small><strong>${escapeHtml(meta.claimNumber)}</strong></div><div><small>תאריך ייצוא</small><strong>${escapeHtml(exportedAt)}</strong></div><div><small>תעודת זהות</small><strong>${escapeHtml(meta.insuredId)}</strong></div><div><small>מספר פוליסה</small><strong>${escapeHtml(meta.policyNumber)}</strong></div></div>${rows}<div class="footer">הופק באמצעות PULSE — תחשיב נזק ידני</div></body></html>`;
};

export default function DamagesDrawer({ open, onOpen, onClose, meta }) {
  const [values, setValues] = useState(() => {
    try { return { ...emptyValues(), ...(JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}) }; }
    catch { return emptyValues(); }
  });
  const [expanded, setExpanded] = useState(new Set());
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setSavedAt(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
  }, [values]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const updateValue = (label, field, value) => setValues((current) => ({ ...current, [label]: { ...current[label], [field]: value } }));
  const toggleRow = (label) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(label)) next.delete(label); else next.add(label);
    return next;
  });
  const clearWorksheet = () => { if (window.confirm("לנקות את כל שדות תחשיב הנזק?")) setValues(emptyValues()); };
  const buildExport = async () => damagesHtml(meta, values, await toDataUrl(pulseLogo));
  const exportHtml = async () => {
    const file = new Blob([await buildExport()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `damages-calculation-${meta.claimNumber}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const printDamages = async () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write("<!doctype html><html lang=\"he\" dir=\"rtl\"><body>טוען תחשיב נזק…</body></html>");
    const html = await buildExport();
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
  };

  return (
    <>
      <button className="side-utility-tab damages-tab" type="button" onClick={open ? onClose : onOpen} aria-controls="damages-drawer" aria-expanded={open}>
        <span aria-hidden="true">₪</span><span>תחשיב נזק</span>
      </button>
      {open && <aside className="side-drawer damages-drawer" id="damages-drawer" dir="rtl" aria-label="תחשיב נזק ידני">
        <header className="drawer-head">
          <div><span className="drawer-kicker">גליון עבודה ידני</span><h2>תחשיב נזק</h2><p>הזנה ידנית בלבד — ללא חישוב אוטומטי.</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="סגירת תחשיב נזק">×</button>
        </header>
        <div className="drawer-tools">
          <span className="drawer-save-state">{savedAt ? `נשמר בטיוטה · ${savedAt}` : "טיוטה מקומית"}</span>
          <div className="damages-export-actions"><button className="text-action" type="button" onClick={exportHtml}>ייצוא HTML</button><button className="text-action" type="button" onClick={printDamages}>הדפסה / PDF</button><button className="text-action danger-text" type="button" onClick={clearWorksheet}>נקה</button></div>
        </div>
        <div className="damages-list">
          {groups.map((group) => <section className="damages-group" key={group}>
            <h3>{groupLabels[group]}</h3>
            {damageRows.filter((row) => row.group === group).map((row) => <DamageCard key={row.label} row={row} value={values[row.label]} isExpanded={expanded.has(row.label)} onToggle={toggleRow} onChange={updateValue} />)}
          </section>)}
        </div>
      </aside>}
    </>
  );
}

function DamageCard({ row, value, isExpanded, onToggle, onChange }) {
  const input = (field, label, props = {}) => <input aria-label={`${label} — ${row.label}`} value={value[field]} onChange={(event) => onChange(row.label, field, event.target.value)} {...props} />;
  return <article className={`damage-card ${isExpanded ? "is-expanded" : ""}`}>
    <div className="damage-card-summary">
      <button type="button" className="damage-card-toggle" onClick={() => onToggle(row.label)} aria-expanded={isExpanded}><span className="damage-chevron">⌄</span><strong>{row.label}</strong></button>
      {input("amount", "סכום", { className: "amount-input", inputMode: "decimal", placeholder: "₪ 0" })}
    </div>
    {isExpanded && <div className="damage-card-fields">
      <label>פרטים{input("details", "פרטים", { placeholder: "הזנה ידנית" })}</label>
      <label>פירוט החישוב<textarea aria-label={`פירוט החישוב — ${row.label}`} value={value.calculation} onChange={(event) => onChange(row.label, "calculation", event.target.value)} placeholder="פירוט ידני" rows="2" /></label>
      {row.hasRate && <label>שיעור{input("rate", "שיעור", { inputMode: "decimal", placeholder: "___%" })}</label>}
      <label>הערות<textarea aria-label={`הערות — ${row.label}`} value={value.notes} onChange={(event) => onChange(row.label, "notes", event.target.value)} placeholder="הערות" rows="2" /></label>
    </div>}
  </article>;
}
