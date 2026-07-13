import { useState } from "react";
import EditModal from "./EditModal";

export default function GapsPanel({ gaps, setGaps, onSource, onAudit }) {
  const [openIds, setOpenIds] = useState(new Set());
  const [adding, setAdding] = useState(false);
  const toggle = (index) => setOpenIds((current) => { const next = new Set(current); next.has(index) ? next.delete(index) : next.add(index); return next; });
  const fields = [
    { name: "topic", label: "נושא הפער" }, { name: "positionA", label: "עמדה א׳" }, { name: "sourceA", label: "מקור א׳" }, { name: "whatA", label: "הסבר מקור א׳", type: "textarea", rows: 2 },
    { name: "positionB", label: "עמדה ב׳" }, { name: "sourceB", label: "מקור ב׳" }, { name: "whatB", label: "הסבר מקור ב׳", type: "textarea", rows: 2 }, { name: "detail", label: "סיכום מורחב של הפער", type: "textarea", rows: 4 },
  ];
  return (
    <section className="panel">
      <div className="section-controls"><button className="text-action" onClick={() => setAdding(true)}>הוסף פער</button></div>
      <div className="gap-list">
        {gaps.map((gap, index) => {
          const open = openIds.has(index);
          return <article className="gap-card" key={`${gap.topic}-${index}`}>
            <div className="gap-head-row"><button className="gap-head" onClick={() => toggle(index)} aria-expanded={open}><span><strong>{gap.topic}</strong><small>{gap.detail}</small></span><span className="gap-sources"><em>א׳ {gap.positionA}</em><em>ב׳ {gap.positionB}</em></span><span className="chevron">{open ? "−" : "+"}</span></button></div>
            {open && <div className="gap-body"><p>{gap.detail}</p><div className="gap-source"><strong>מקור א׳</strong><button className="source-link" onClick={() => onSource(gap.sourceA)}>{gap.sourceA.title}</button><span>{gap.whatA}</span></div><div className="gap-source"><strong>מקור ב׳</strong><button className="source-link" onClick={() => onSource(gap.sourceB)}>{gap.sourceB.title}</button><span>{gap.whatB}</span></div></div>}
          </article>;
        })}
      </div>
      <div className="bottom-add"><button className="text-action" onClick={() => setAdding(true)}>הוסף פער</button></div>
      {adding && <EditModal title="הוספת פער" fields={fields} initialValues={{ topic: "", positionA: "", sourceA: "", whatA: "", positionB: "", sourceB: "", whatB: "", detail: "" }} onCancel={() => setAdding(false)} onSave={(values) => { setGaps((items) => [...items, { topic: values.topic, positionA: values.positionA, positionB: values.positionB, detail: values.detail, sourceA: { title: values.sourceA, date: "", type: "מקור", content: values.whatA, aiSummary: values.whatA, fullSummary: values.whatA }, whatA: values.whatA, sourceB: { title: values.sourceB, date: "", type: "מקור", content: values.whatB, aiSummary: values.whatB, fullSummary: values.whatB }, whatB: values.whatB }]); onAudit?.({ action: "הוספה", section: "סתירות ופערים", item: values.topic, field: "פער", previousValue: "", newValue: values.detail }); setAdding(false); }} />}
    </section>
  );
}
