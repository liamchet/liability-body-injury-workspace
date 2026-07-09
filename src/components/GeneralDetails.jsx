export default function GeneralDetails({ details }) {
  return (
    <div className="details-list">
      {details.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
