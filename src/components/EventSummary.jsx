import { useState } from "react";
import EditModal from "./EditModal";

export default function EventSummary({ event, onSource, onUpdate }) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="panel event-panel">
      <div className="editable-summary">
        <p>{event.text}</p>
        <button className="icon-action" title="ערוך נסיבות אירוע" aria-label="ערוך נסיבות אירוע" onClick={() => setEditing(true)}>✎</button>
      </div>
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

      {editing && (
        <EditModal
          title="עריכת נסיבות האירוע"
          fields={[
            { name: "text", label: "סיכום מלא", type: "textarea", rows: 7 },
          ]}
          initialValues={{ text: event.text }}
          onCancel={() => setEditing(false)}
          onSave={(values) => {
            onUpdate({ ...event, text: values.text });
            setEditing(false);
          }}
        />
      )}
    </section>
  );
}
