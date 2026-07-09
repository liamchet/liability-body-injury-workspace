import { useState } from "react";

export default function ExpertOpinions({ experts, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set(["ortho", "neuro"]));

  const toggle = (id) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  const expandAll = () => setOpenIds(new Set(experts.map((expert) => expert.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <section className="panel">
      <div className="section-controls">
        <button className="ghost-button" onClick={expandAll}>הרחב הכל</button>
        <button className="ghost-button" onClick={collapseAll}>צמצם הכל</button>
      </div>

      <div className="expert-list">
        {experts.map((expert) => {
          const open = openIds.has(expert.id);
          const source = {
            title: expert.source,
            date: expert.date,
            type: expert.role,
            section: "חוות דעת מומחים",
            preview: expert.opinion,
          };

          return (
            <article className="expert-row" key={expert.id}>
              <div className="expert-head-row">
                <button className="expert-head" onClick={() => toggle(expert.id)} aria-expanded={open}>
                  <span className="expert-name">{expert.name}</span>
                  <span>{expert.role}</span>
                  <span>{expert.field}</span>
                  <span className="date-pill">{expert.date}</span>
                  <strong className="percent">{expert.disability || "לא נמצא במסמכים"}</strong>
                  <span className="row-summary">{expert.opinion}</span>
                  <span className="chevron">{open ? "−" : "+"}</span>
                </button>
                <button className="source-link compact" onClick={() => onSource(source)}>
                  פתח מקור
                </button>
              </div>

              {open && (
                <div className="expert-body">
                  <p>{expert.opinion}</p>
                  <dl>
                    <div>
                      <dt>אחוזי נכות / קביעה</dt>
                      <dd>{expert.disability || "לא נמצא במסמכים"}</dd>
                    </div>
                    <div>
                      <dt>מסמך מקור</dt>
                      <dd>{expert.source}</dd>
                    </div>
                  </dl>
                  <button className="ghost-button" onClick={() => onSource(source)}>
                    פתח מקור
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
