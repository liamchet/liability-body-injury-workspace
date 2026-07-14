import { useEffect, useState } from "react";

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

export default function DamagesDrawer({ open, onOpen, onClose }) {
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
          <button className="text-action danger-text" type="button" onClick={clearWorksheet}>נקה</button>
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
