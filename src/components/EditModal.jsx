import { useState } from "react";

export default function EditModal({ title, fields, initialValues, onCancel, onSave }) {
  const [values, setValues] = useState(initialValues);

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="edit-modal">
        <div className="modal-head compact-head">
          <h2>{title}</h2>
          <button onClick={onCancel} aria-label="סגור">×</button>
        </div>

        <div className="edit-form">
          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  rows={field.rows || 4}
                  value={values[field.name] || ""}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
              ) : (
                <input
                  value={values[field.name] || ""}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>

        <div className="edit-actions">
          <button className="primary-button" onClick={() => onSave(values)}>שמור</button>
          <button className="ghost-button" onClick={onCancel}>ביטול</button>
        </div>
      </div>
    </div>
  );
}
