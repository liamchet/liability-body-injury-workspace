export default function DocumentsPanel({ documents, onSource }) {
  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="data-table documents-table">
          <thead>
            <tr>
              <th>#</th>
              <th>שם מסמך</th>
              <th>סוג מסמך</th>
              <th>תאריך מסמך</th>
              <th>נכלל בסיכום</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const source = {
                title: doc[1],
                type: doc[2],
                date: doc[3],
                section: "מסמכים שנקראו",
                preview: `תצוגה מקדימה מקוצרת של ${doc[1]}. הנתונים בתצוגה זו אנונימיים ומיועדים לאימות מול המקור.`,
              };

              return (
                <tr key={doc[0]}>
                  <td>{doc[0]}</td>
                  <td>{doc[1]}</td>
                  <td>{doc[2]}</td>
                  <td>{doc[3]}</td>
                  <td><span className={`badge ${doc[4] === "חלקית" ? "warning" : "success"}`}>{doc[4]}</span></td>
                  <td>
                    <button className="source-link compact" onClick={() => onSource(source)}>
                      פתח מקור
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
