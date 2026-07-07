export default function GeneralDetails({ meta, profile }) {
  const rows = [
    ["מספר תביעה", meta.claimNumber],
    ["מספר פוליסה", meta.policyNumber],
    ["תאריך התאונה", meta.accidentDate],
    ["שם התובע / הנפגע", meta.claimant],
    ["מהות התביעה", meta.type],
    ["סטטוס תיק", meta.status],
    ...profile.filter(([label]) => !["נפגעת", "מהות התביעה"].includes(label)),
  ];

  return (
    <div className="details-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
