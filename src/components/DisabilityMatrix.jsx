const columnIds = ["prediction", "ortho", "neuro", "psych", "rheum", "malal"];
const fallbackHeaders = ["חיזוי", "מומחה אורתופדי", "מומחה נוירולוגי", "מומחה פסיכיאטרי", "מומחה ראומטולוגי", "מל\"ל"];

export default function DisabilityMatrix({ rows, experts, onSource }) {
  const columns = columnIds.map((id, index) => {
    const expert = experts.find((item) => item.id === id);
    return { id, label: expert?.expertName || fallbackHeaders[index], source: expert?.source };
  });
  const headers = ["תחום", ...columns.map((column) => column.label)];

  return (
    <section className="panel disability-inside-experts">
      <div className="panel-title compact"><h2>טבלת הערכות נכות</h2></div>
      <div className="table-wrap">
        <table className="data-table disability-table">
          <thead><tr>{headers.map((header, index) => {
            const expert = index > 0 ? experts.find((item) => item.id === columns[index - 1]?.id) : null;
            const source = expert?.source;
            return <th key={header}>{source ? <button className="source-link matrix-source" onClick={() => onSource(source, { title: expert.documentTitle || source.title, date: expert.documentDate, aiSummary: expert.shortSummary, fullSummary: expert.fullSummary, disabilityBreakdown: expert.disabilityBreakdown, temporaryDisability: expert.temporaryDisability, permanentDisability: expert.permanentDisability, totalDisability: expert.totalDisability })}>{header}</button> : header}</th>;
          })}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.slice(0, headers.length).map((cell, index) => <td key={`${row[0]}-${index}`} className={String(cell).includes("%") ? "has-percent" : ""}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
