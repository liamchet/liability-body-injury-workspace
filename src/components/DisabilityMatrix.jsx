const columnIds = ["prediction", "ortho", "neuro", "psych", "rheum", "malal"];
const fallbackHeaders = ["חיזוי", "מומחה אורתופדי", "מומחה נוירולוגי", "מומחה פסיכיאטרי", "מומחה ראומטולוגי", "מל\"ל"];

export default function DisabilityMatrix({ rows, experts, onSource }) {
  const columns = columnIds.map((id, index) => {
    const expert = experts.find((item) => item.id === id);
    return { id, label: expert?.name || fallbackHeaders[index], source: expert?.source };
  });
  const headers = ["תחום", ...columns.map((column) => column.label), "הערת פער"];

  return (
    <section className="panel disability-inside-experts">
      <div className="panel-title compact"><h2>טבלת הערכות נכות</h2></div>
      <div className="table-wrap">
        <table className="data-table disability-table">
          <thead><tr>{headers.map((header, index) => {
            const source = index > 0 && index < headers.length - 1 ? columns[index - 1]?.source : null;
            return <th key={header}>{source ? <button className="source-link matrix-source" onClick={() => onSource(source)}>{header}</button> : header}</th>;
          })}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cell.includes("%") ? "has-percent" : ""}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
