export default function EventSummary({ event, onSource }) {
  return (
    <section className="panel event-panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">מה קרה בתיק</span>
          <h2>{event.title}</h2>
        </div>
        <button className="ghost-button" onClick={() => onSource({ title: event.source, type: "נסיבות האירוע", preview: event.text })}>
          פתח מקור
        </button>
      </div>
      <p>{event.text}</p>
      <div className="source-line">מקור: {event.source}</div>
    </section>
  );
}
