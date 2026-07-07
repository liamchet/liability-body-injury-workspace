export default function OverviewCards({ cards, onNavigate }) {
  return (
    <section className="overview-cards">
      {cards.map((card) => (
        <button key={card.id} className={`summary-card tone-${card.tone}`} onClick={() => onNavigate(card.section ?? card.tab)}>
          <span>{card.title}</span>
          <strong>{card.value}</strong>
          <small>{card.detail}</small>
        </button>
      ))}
    </section>
  );
}
