import { useState } from "react";

export default function GapsPanel({ gaps, onSource }) {
  const [openIds, setOpenIds] = useState(new Set([0]));

  const toggle = (index) => {
    const next = new Set(openIds);
    next.has(index) ? next.delete(index) : next.add(index);
    setOpenIds(next);
  };

  return (
    <section className="panel">
      <div className="gap-list">
        {gaps.map(([topic, sourceA, sourceB, description, severity, status], index) => {
          const open = openIds.has(index);
          const sourceAObject = {
            title: sourceA,
            type: "מקור א׳",
            date: "לא נמצא במסמכים",
            section: "סתירות ופערים",
            preview: `${sourceA}: ${description}`,
          };
          const sourceBObject = {
            title: sourceB,
            type: "מקור ב׳",
            date: "לא נמצא במסמכים",
            section: "סתירות ופערים",
            preview: `${sourceB}: ${description}`,
          };

          return (
            <article className="gap-card" key={topic}>
              <button className="gap-head" onClick={() => toggle(index)} aria-expanded={open}>
                <span>
                  <strong>{topic}</strong>
                  <small>{description}</small>
                </span>
                <span className="gap-sources">
                  <em>א׳ {sourceA}</em>
                  <em>ב׳ {sourceB}</em>
                </span>
                <span className={`badge severity-${severity}`}>{severity}</span>
                <span className="badge neutral">{status}</span>
                <span className="chevron">{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="gap-body">
                  <p>{description}</p>
                  <div className="source-compare">
                    <div>
                      <strong>מקור א׳</strong>
                      <span>{sourceA}</span>
                      <button className="source-link compact" onClick={() => onSource(sourceAObject)}>פתח מקור א׳</button>
                    </div>
                    <div>
                      <strong>מקור ב׳</strong>
                      <span>{sourceB}</span>
                      <button className="source-link compact" onClick={() => onSource(sourceBObject)}>פתח מקור ב׳</button>
                    </div>
                  </div>
                  <p className="quiet-note">המערכת מציגה את הפער בלבד ואינה מכריעה איזו גרסה נכונה.</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
