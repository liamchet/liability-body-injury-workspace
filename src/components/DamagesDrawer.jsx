import { useEffect, useState } from "react";

const STORAGE_KEY = "pulse-manual-damages-v1";

const damageRows = [
  ["עבר", "אובדן הכנסה / הפסדי שכר עבר"],
  ["עבר", "הפסדי פנסיה עבר"],
  ["עבר", "עזרת צד ג׳ עבר"],
  ["עבר", "ניידות עבר"],
  ["עבר", "הוצאות רפואיות עבר"],
  ["עבר", "הוצאות אחרות עבר"],
  ["עתיד", "אובדן כושר השתכרות / הפסדי שכר עתיד"],
  ["עתיד", "הפסדי פנסיה עתיד"],
  ["עתיד", "עזרת צד ג׳ עתיד"],
  ["עתיד", "ניידות עתיד"],
  ["עתיד", "הוצאות רפואיות עתיד"],
  ["עתיד", "דיור"],
  ["עתיד", "שכר אפוטרופוס"],
  ["עתיד", "אביזרים"],
  ["עתיד", "כביסה, מחשב, מזגנים והוצאות נלוות"],
  ["עתיד", "כאב וסבל"],
  ["עתיד", "ראש נזק אחר"],
  ["סיכום", "סיכום ביניים"],
  ["ניכויים", "ניכוי אשם תורם / אחריות", true],
  ["ניכויים", "ניכוי מל״ל"],
  ["ניכויים", "ניכוי מיטיב"],
  ["ניכויים", "ניכוי תשלום תכוף"],
  ["סיכום", "סכום לאחר ניכויים"],
  ["סיכום", "שכר טרחה", true],
  ["סיכום", "מע״מ", true],
  ["סיכום", "סכום כולל"],
  ["הצעות", "חלק החברה / חלקנו"],
  ["הצעות", "הצעת תובע"],
  ["הצעות", "הצעת נתבע"],
  ["הצעות", "הצעת מגשר"],
  ["הצעות", "הערות וסיכום התיק"],
].map(([group, label, hasRate]) => ({ group, label, hasRate }));

const groupLabels = {
  עבר: "נזקי עבר",
  עתיד: "נזקי עתיד",
  סיכום: "סיכומים",
  ניכויים: "ניכויים",
  הצעות: "הצעות והערות",
};

const emptyValues = () => Object.fromEntries(damageRows.map((row) => [row.label, {
  details: "", calculation: "", amount: "", notes: "", rate: "",
}]));

export default function DamagesDrawer({ open, onOpen, onClose }) {
  const [values, setValues] = useState(() => {
    try {
      return { ...emptyValues(), ...(JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}) };
    } catch {
      return emptyValues();
    }
  });
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

  const updateValue = (label, field, value) => {
    setValues((current) => ({ ...current, [label]: { ...current[label], [field]: value } }));
  };

  const clearWorksheet = () => {
    if (window.confirm("לנקות את כל שדות תחשיב הנזק?")) setValues(emptyValues());
  };

  return (
    <>
      <button className="side-utility-tab damages-tab" type="button" onClick={open ? onClose : onOpen} aria-controls="damages-drawer" aria-expanded={open}>
        <span aria-hidden="true">₪</span> תחשיב נזק
      </button>
      {open && (
        <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
          <aside className="side-drawer damages-drawer" id="damages-drawer" dir="rtl" aria-label="תחשיב נזק ידני">
            <header className="drawer-head">
              <div>
                <span className="drawer-kicker">גליון עבודה ידני</span>
                <h2>תחשיב נזק</h2>
                <p>הזינו את הנתונים באופן ידני בלבד. לא מוצעים או מחושבים ערכים אוטומטיים.</p>
              </div>
              <button className="modal-close" type="button" onClick={onClose} aria-label="סגירת תחשיב נזק">×</button>
            </header>
            <div className="drawer-tools">
              <span className="drawer-save-state">{savedAt ? `נשמר בטיוטה · ${savedAt}` : "טיוטה מקומית"}</span>
              <button className="text-action danger-text" type="button" onClick={clearWorksheet}>נקה טבלה</button>
            </div>
            <div className="damages-table-wrap">
              <table className="data-table damages-table">
                <thead><tr><th>ראש נזק / פריט</th><th>פרטים</th><th>פירוט החישוב</th><th>סכום</th><th>הערות</th></tr></thead>
                <tbody>{damageRows.map((row, index) => <DamageRow key={row.label} row={row} firstInGroup={!index || damageRows[index - 1].group !== row.group} value={values[row.label]} onChange={updateValue} />)}</tbody>
              </table>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function DamageRow({ row, firstInGroup, value, onChange }) {
  const input = (field, label, props = {}) => <input aria-label={`${label} — ${row.label}`} value={value[field]} onChange={(event) => onChange(row.label, field, event.target.value)} {...props} />;
  return <>
    {firstInGroup && <tr className="damages-group-row"><th colSpan="5">{groupLabels[row.group]}</th></tr>}
    <tr>
      <th scope="row"><strong>{row.label}</strong>{row.hasRate && <label className="rate-field">שיעור: {input("rate", "שיעור", { inputMode: "decimal", placeholder: "___%" })}</label>}</th>
      <td>{input("details", "פרטים", { placeholder: "הזנה ידנית" })}</td>
      <td><textarea aria-label={`פירוט החישוב — ${row.label}`} value={value.calculation} onChange={(event) => onChange(row.label, "calculation", event.target.value)} placeholder="פירוט ידני" rows="2" /></td>
      <td>{input("amount", "סכום", { className: "amount-input", inputMode: "decimal", placeholder: "₪ 0" })}</td>
      <td><textarea aria-label={`הערות — ${row.label}`} value={value.notes} onChange={(event) => onChange(row.label, "notes", event.target.value)} placeholder="הערות" rows="2" /></td>
    </tr>
  </>;
}
