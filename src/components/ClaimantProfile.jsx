export default function ClaimantProfile({ profile }) {
  return (
    <section className="panel">
      <div className="panel-title compact">
        <h2>פרופיל נפגעת</h2>
      </div>
      <dl className="profile-list">
        {profile.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
