export default function ProcessingStatus({ meta, documents }) {
  return (
    <section className="panel">
      <div className="panel-title compact">
        <h2>סטטוס עיבוד AI</h2>
        <span className="badge success">{meta.aiStatus}</span>
      </div>
      <div className="progress-track"><span style={{ width: "86%" }} /></div>
      <p className="muted">הסיכום מבוסס על מסמכי מקור אנונימיים. פערים מסומנים לבדיקה אנושית.</p>
      <div className="mini-docs">
        {documents.map((doc) => (
          <button key={doc[0]}>{doc[1]} <span>{doc[4]}</span></button>
        ))}
      </div>
    </section>
  );
}
