import EditedIndicator from "./EditedIndicator";

export default function AuditTrail({ entries }) {
  if (!entries.length) {
    return <div className="audit-empty">טרם בוצעו שינויים ידניים בתיק.</div>;
  }

  return (
    <section className="audit-trail">
      <div className="table-wrap">
        <table className="data-table audit-table">
          <thead><tr><th>זמן</th><th>משתמש</th><th>פעולה</th><th>סעיף / מסמך</th><th>שדה</th><th>ערך קודם</th><th>ערך חדש</th></tr></thead>
          <tbody>{entries.map((entry) => (
            <tr key={entry.id}>
              <td className="audit-time">{entry.timestamp}</td>
              <td>{entry.user}</td>
              <td><strong>{entry.action}</strong><EditedIndicator metadata={{ editedBy: entry.user, editedAt: entry.timestamp }} compact /></td>
              <td>{entry.section}<small>{entry.item}</small></td>
              <td>{entry.field || "—"}</td>
              <td className="audit-value">{entry.previousValue || "—"}</td>
              <td className="audit-value">{entry.newValue || "—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
