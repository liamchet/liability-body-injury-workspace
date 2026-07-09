import { useState } from "react";
import EditModal from "./EditModal";

export default function ExpertOpinions({ experts, setExperts, onSource }) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const [editing, setEditing] = useState(null);

  const toggle = (id) => {
    const next = new Set(openIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenIds(next);
  };

  const expandAll = () => setOpenIds(new Set(experts.map((expert) => expert.id)));
  const collapseAll = () => setOpenIds(new Set());
  const breakdownText = (expert) => (expert.breakdown || []).map((item) => `${item.label}: ${item.value}`).join("\n");
  const parseBreakdown = (text) => text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...valueParts] = line.split(":");
      return { label: label.trim(), value: valueParts.join(":").trim() };
    })
    .filter((item) => item.label && item.value);

  const saveExpert = (values) => {
    setExperts((items) => items.map((item) => (
      item.id === editing.id
        ? {
            ...item,
            date: values.date,
            name: values.name,
            role: values.role,
            disability: values.disability,
            opinion: values.opinion,
            full: values.full,
            breakdown: parseBreakdown(values.breakdown),
            source: { ...item.source, title: values.sourceTitle, date: values.sourceDate || item.source.date },
          }
        : item
    )));
    setEditing(null);
  };

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
              <div className="expert-head-row">
                <button className="expert-head" onClick={() => toggle(expert.id)} aria-expanded={open}>
                  <span className="date-pill">{expert.date}</span>
                  <span className="expert-name">{expert.name} – {expert.role}</span>
                  <strong className="percent">{expert.disability || "לא נמצא במסמכים"}</strong>
                  <span className="row-summary">{expert.opinion}</span>
                  <span className="chevron">{open ? "−" : "+"}</span>
                </button>
                <div className="row-actions">
                  <button className="icon-action" title="ערוך" aria-label="ערוך" onClick={() => setEditing(expert)}>✎</button>
                </div>
              </div>

              {open && (
                <div className="expert-body">
                  <p>{expert.full || expert.opinion}</p>
                  {(expert.breakdown?.length > 0 || expert.disability) && (
                    <div className="mini-breakdown">
                      {expert.breakdown?.map((item) => (
                        <span key={`${expert.id}-${item.label}`}>{item.label}: <b>{item.value}</b></span>
                      ))}
                      {expert.disability && <strong>סה"כ: {expert.disability}</strong>}
                    </div>
                  )}
                  <div className="item-footer">
                    <span>מקור:</span>
                    <button className="source-link" onClick={() => onSource(expert.source)}>
                      {expert.source.title}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {editing && (
        <EditModal
          title="עריכת חוות דעת מומחה"
          fields={[
            { name: "date", label: "תאריך" },
            { name: "name", label: "שם מומחה" },
            { name: "role", label: "תחום" },
            { name: "disability", label: "סה\"כ / המלצת נכות" },
            { name: "opinion", label: "סיכום שורה", type: "textarea", rows: 2 },
            { name: "full", label: "סיכום מלא", type: "textarea", rows: 6 },
            { name: "breakdown", label: "פירוט נכות - שורה לכל תחום בפורמט תחום: אחוז", type: "textarea", rows: 4 },
            { name: "sourceTitle", label: "שם מקור" },
            { name: "sourceDate", label: "תאריך מקור" },
          ]}
          initialValues={{
            date: editing.date,
            name: editing.name,
            role: editing.role,
            disability: editing.disability || "",
            opinion: editing.opinion || "",
            full: editing.full || editing.opinion || "",
            breakdown: breakdownText(editing),
            sourceTitle: editing.source?.title || "",
            sourceDate: editing.source?.date || "",
          }}
          onCancel={() => setEditing(null)}
          onSave={saveExpert}
        />
      )}
    </section>
  );
}
