export default function ExpertOpinions({ experts, onSource }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">חוות דעת מומחים</span>
          <h2>קביעות רפואיות ואחוזי נכות</h2>
        </div>
        <span className="badge warning">ללא הכרעה בין חוות דעת</span>
      </div>
      <div className="expert-grid">
        {experts.map((expert) => (
          <button
            key={expert.id}
            className="expert-card"
            onClick={() => onSource({ title: expert.source, type: expert.role, preview: expert.opinion })}
          >
            <span className="badge neutral">{expert.role}</span>
            <h3>{expert.name}</h3>
            <small>{expert.date} · {expert.field}</small>
            <p>{expert.opinion}</p>
            <strong className="percent">{expert.disability}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
