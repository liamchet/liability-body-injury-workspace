const headers = ["תחום", "חיזוי", "מומחה אורתופדי", "מומחה נוירולוגי", "מומחה פסיכיאטרי", "מומחה ראומטולוגי", "מל״ל", "הערת פער"];

export default function DisabilityMatrix({ rows, experts, onSource }) {
  const sourceForHeader = (header) => {
    const roleMap = { "מומחה אורתופדי": "אורתופדיה", "מומחה נוירולוגי": "נוירולוגיה", "מומחה פסיכיאטרי": "פסיכיאטריה", "מומחה ראומטולוגי": "ראומטולוגיה" };
    return experts.find((expert) => expert.role === roleMap[header])?.source;
  };

  return (
    <section className="panel disability-inside-experts">
      <div className="panel-title compact"><h2>טבלת הערכות נכות</h2></div>
      <div className="table-wrap">
        <table className="data-table disability-table">
          <thead><tr>{headers.map((header) => {
            const source = sourceForHeader(header);
            return <th key={header}>{source ? <button className="source-link matrix-source" onClick={() => onSource(source)}>{header}</button> : header}</th>;
          })}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cell.includes("%") ? "has-percent" : ""}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
