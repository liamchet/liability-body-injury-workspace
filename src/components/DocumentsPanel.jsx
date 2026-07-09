export default function DocumentsPanel({ documents, onSource }) {
  return (
    <section className="panel">
      <div className="table-wrap">
        <table className="data-table documents-table">
          <thead>
            <tr>
              <th>שם מסמך</th>
              <th>סוג מסמך / כותרת</th>
              <th>תאריך מסמך</th>
              <th>נכלל בסיכום</th>
              <th>מקור</th>
              <th>חילוץ %</th>
              <th>הערות AI על החילוץ</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={`${doc.name}-${doc.date}`}>
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.date}</td>
                <td>{doc.included}</td>
                <td>
                  <button className="source-link" onClick={() => onSource(doc.source)}>
                    {doc.source.title}
                  </button>
                </td>
                <td>{doc.extraction}</td>
                <td>{doc.aiNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
