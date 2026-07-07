const headers = ["תחום", "חיזוי", "מומחה אורתופדי", "מומחה נוירולוגי", "מומחה פסיכיאטרי", "מומחה ראומטולוגי", "מל״ל", "הערת פער"];

export default function DisabilityMatrix({ rows }) {
  return (
    <section className="panel">
      <div className="panel-title compact">
        <h2>מטריצת השוואת נכות</h2>
      </div>
      <div className="table-wrap">
        <table className="data-table disability-table">
          <thead>
            <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className={cell.includes("%") ? "has-percent" : ""}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
