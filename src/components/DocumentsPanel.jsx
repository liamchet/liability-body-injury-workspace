import { useMemo, useState } from "react";

const docFilters = ["הכל", "נכלל", "חלקית", "לא נכלל", "דורש בדיקה", "רפואי בלבד", "חוות דעת", "משפטי / אדמין"];

export default function DocumentsPanel({ documents, onSource }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("הכל");

  const filtered = useMemo(() => documents.filter((doc) => {
    const joined = doc.join(" ").toLowerCase();
    const matchQuery = joined.includes(query.toLowerCase());
    const type = doc[2];
    const status = doc[4];
    const processing = doc[5];
    const matchFilter =
      filter === "הכל" ||
      status === filter ||
      processing === filter ||
      (filter === "רפואי בלבד" && /רפואי|מיון|שיקום|הדמיה|ועדה/.test(type)) ||
      (filter === "חוות דעת" && type.includes("חוות דעת")) ||
      (filter === "משפטי / אדמין" && /משפטי|משטרה|חקירה/.test(type));
    return matchQuery && matchFilter;
  }), [documents, query, filter]);

  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">מסמכים ומקורות</span>
          <h2>עיבוד מסמכים</h2>
        </div>
        <span className="badge neutral">{filtered.length} מסמכים מוצגים</span>
      </div>
      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש מסמך, סוג או תאריך" />
        <div className="segmented">
          {docFilters.map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>שם מסמך</th><th>סוג</th><th>תאריך</th><th>נכלל בסיכום</th><th>סטטוס עיבוד</th><th>מקור</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc[0]}>
                {doc.map((cell, index) => (
                  <td key={`${doc[0]}-${index}`}>
                    {index === 4 || index === 5 ? <span className={`badge ${cell === "דורש בדיקה" || cell === "חלקית" ? "warning" : "success"}`}>{cell}</span> : cell}
                  </td>
                ))}
                <td>
                  <button className="ghost-button" onClick={() => onSource({ title: doc[1], type: doc[2], preview: `תצוגה מקדימה מקוצרת של ${doc[1]}. הנתונים בתצוגה זו אנונימיים ומיועדים לאימות מול המקור.` })}>
                    תצוגה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
