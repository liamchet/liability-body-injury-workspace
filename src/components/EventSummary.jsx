import { useState } from "react";
import EditModal from "./EditModal";
import EditedIndicator from "./EditedIndicator";

export default function EventSummary({ event, onSource, onUpdate, onAudit }) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="panel event-panel">
      <div className="editable-summary">
        <p>{event.text}<EditedIndicator metadata={event.editMetadata} compact /></p>
        <button className="icon-action" title="ערוך נסיבות אירוע" aria-label="ערוך נסיבות אירוע" onClick={() => setEditing(true)}>✎</button>
      </div>
      <div className="source-actions inline-sources">
        <span>מקורות:</span>
        {event.sources.map((source) => (
          <button
            className="source-link"
            key={`${source.title}-${source.date}`}
            onClick={() => onSource(source, { aiSummary: source.aiSummary || source.content, fullSummary: source.fullSummary || source.content })}
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
          editedFields={{ text: event.editMetadata }}
          onCancel={() => setEditing(false)}
          onSave={(values) => {
            const timestamp = new Date().toLocaleString("he-IL");
            onAudit?.({ action: "עריכה", section: "נסיבות האירוע", item: "סיכום נסיבות האירוע", field: "סיכום מלא", previousValue: event.text, newValue: values.text });
            onUpdate({ ...event, originalText: event.originalText || event.text, text: values.text, manuallyEdited: true, editMetadata: { editedBy: "מיישב תביעה", editedAt: timestamp } });
            setEditing(false);
          }}
        />
      )}
    </section>
  );
}
