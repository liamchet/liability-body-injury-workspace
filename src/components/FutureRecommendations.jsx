const cards = ["הערכת שווי תיק", "הערכת סיכון", "המלצה להמשך טיפול", "השוואה לתיקים דומים", "ניתוח פסיקה / תקנות / מל״ל", "תחשיב נזק"];

export default function FutureRecommendations() {
  return (
    <section className="future-recommendations" aria-disabled="true">
      <div className="future-title"><span className="section-icon">⌁</span><strong>מנגנון המלצה - אפיק עתידי</strong><span>בקרוב</span></div>
      <p>רכיב זה יוצג באפיק המלצות עתידי ואינו חלק מהגרסה הנוכחית.</p>
      <div>{cards.map((card) => <span key={card}>נעול - {card}</span>)}</div>
    </section>
  );
}
