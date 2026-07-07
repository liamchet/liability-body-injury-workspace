const items = ["הערכת שווי תיק", "הערכת סיכון", "המלצה להמשך טיפול", "השוואה לתיקים דומים", "ניתוח פסיקה / תקנות / מל״ל"];

export default function FutureRecommendations() {
  return (
    <section className="panel future-panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">שלב עתידי</span>
          <h2>הערכת סיכון והמלצה</h2>
        </div>
        <span className="badge neutral">בקרוב</span>
      </div>
      <p className="future-note">בשלב עתידי — אפיק המלצות E2E. המסכים כאן אינם פעילים ואינם מהווים המלצה.</p>
      <div className="future-grid">
        {items.map((item) => (
          <button disabled key={item} className="future-card">
            <span>נעול</span>
            <strong>{item}</strong>
            <small>לא פעיל בגרסת האבטיפוס</small>
          </button>
        ))}
      </div>
      <p className="disclaimer-box">
        המערכת אינה מחליפה את שיקול הדעת של מיישב התביעה ואינה מאשרת או דוחה תביעה באופן אוטומטי.
      </p>
    </section>
  );
}
