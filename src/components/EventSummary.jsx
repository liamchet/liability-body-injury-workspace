export default function EventSummary({ event, onSource }) {
  return (
    <section className="panel event-panel">
      <p>{event.text}</p>
      <div className="source-line">מקור: {event.source}</div>
      <div className="source-actions">
        {event.sources.map((source) => (
          <button
            className="source-link"
            key={`${source.title}-${source.date}`}
            onClick={() => onSource({ ...source, preview: event.text })}
          >
            פתח מקור: {source.title}
          </button>
        ))}
      </div>
    </section>
  );
}
