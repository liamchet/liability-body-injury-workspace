import { useState } from "react";
import EditModal from "./EditModal";

const headers = ["תחום", "חיזוי", "מומחה אורתופדי", "מומחה נוירולוגי", "מומחה פסיכיאטרי", "מומחה ראומטולוגי", "מל״ל", "הערת פער"];

export default function DisabilityMatrix({ rows, setRows }) {
  const [editing, setEditing] = useState(false);
  const tableText = rows.map((row) => row.join(" | ")).join("\n");

  const saveRows = (values) => {
    const nextRows = values.rows
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const cells = line.split("|").map((cell) => cell.trim());
        return [...cells, ...Array(headers.length).fill("-")].slice(0, headers.length);
      });
    setRows(nextRows);
    setEditing(false);
  };

  return (
    <section className="panel">
      <div className="panel-title compact">
        <h2>מטריצת השוואת נכות</h2>
        <button className="icon-action" title="ערוך מטריצה" aria-label="ערוך מטריצה" onClick={() => setEditing(true)}>✎</button>
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

      {editing && (
        <EditModal
          title="עריכת טבלת הערכות נכות"
          fields={[
            { name: "rows", label: "שורות הטבלה - הפרד עמודות באמצעות |", type: "textarea", rows: 10 },
          ]}
          initialValues={{ rows: tableText }}
          onCancel={() => setEditing(false)}
          onSave={saveRows}
        />
      )}
    </section>
  );
}
