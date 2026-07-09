import { useState } from "react";

export default function ExpertOpinions({ experts, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set());

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
        <button className="text-control" onClick={expandAll}>הרחב הכל</button>
        <span>|</span>
        <button className="text-control" onClick={collapseAll}>צמצם הכל</button>
      </div>

      <div className="expert-list">
        {experts.map((expert) => {
          const open = openIds.has(expert.id);

          return (
            <article className="expert-row" key={expert.id}>
              <button className="expert-head" onClick={() => toggle(expert.id)} aria-expanded={open}>
                <span className="date-pill">{expert.date}</span>
                <span className="expert-name">{expert.name}</span>
                <span>{expert.role}</span>
                <strong className="percent">{expert.disability || "לא נמצא במסמכים"}</strong>
                <span className="row-summary">{expert.opinion}</span>
                <span className="chevron">{open ? "−" : "+"}</span>
              </button>

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
                      <dd>
                        <button className="source-link" onClick={() => onSource(expert.source)}>
                          {expert.source.title}
                        </button>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
