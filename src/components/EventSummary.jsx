export default function EventSummary({ event, onSource }) {
  return (
    <section className="panel event-panel">
      <p>{event.text}</p>
      <div className="source-actions inline-sources">
        <span>מקורות:</span>
        {event.sources.map((source) => (
          <button
            className="source-link"
            key={`${source.title}-${source.date}`}
            onClick={() => onSource(source)}
          >
            {source.title}
          </button>
        ))}
      </div>
    </section>
  );
}
