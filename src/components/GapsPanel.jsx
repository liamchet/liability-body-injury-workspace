export default function GapsPanel({ gaps }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">פערים מהותיים בלבד</span>
          <h2>סתירות ונושאים לבדיקה</h2>
        </div>
        <span className="badge warning">המערכת אינה מכריעה מי צודק</span>
      </div>
      <div className="gap-list">
        {gaps.map(([topic, sourceA, sourceB, description, severity, status]) => (
          <article className="gap-card" key={topic}>
            <div>
              <h3>{topic}</h3>
              <p>{description}</p>
              <small>{sourceA} מול {sourceB}</small>
            </div>
            <div className="gap-badges">
              <span className={`badge severity-${severity}`}>{severity}</span>
              <span className="badge neutral">{status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
