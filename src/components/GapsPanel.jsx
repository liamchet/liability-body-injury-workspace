import { useState } from "react";

export default function GapsPanel({ gaps, onSource }) {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (index) => {
    const next = new Set(openIds);
    next.has(index) ? next.delete(index) : next.add(index);
    setOpenIds(next);
  };

  return (
    <section className="panel">
      <div className="gap-list">
        {gaps.map((gap, index) => {
          const open = openIds.has(index);

          return (
            <article className="gap-card" key={gap.topic}>
              <button className="gap-head" onClick={() => toggle(index)} aria-expanded={open}>
                <span>
                  <strong>{gap.topic}</strong>
                  <small>{gap.positionA}</small>
                </span>
                <span className="gap-sources">
                  <em>{gap.positionA}</em>
                  <em>{gap.positionB}</em>
                </span>
                <span className="chevron">{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="gap-body">
                  <p>{gap.detail}</p>
                  <div className="source-compare">
                    <div>
                      <strong>מקור א׳</strong>
                      <button className="source-link" onClick={() => onSource(gap.sourceA)}>{gap.sourceA.title}</button>
                      <span>{gap.whatA}</span>
                    </div>
                    <div>
                      <strong>מקור ב׳</strong>
                      <button className="source-link" onClick={() => onSource(gap.sourceB)}>{gap.sourceB.title}</button>
                      <span>{gap.whatB}</span>
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
