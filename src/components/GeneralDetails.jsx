import EditedIndicator from "./EditedIndicator";

export default function GeneralDetails({ details, editedFields = {} }) {
  return (
    <div className="details-list">
      {details.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}<EditedIndicator metadata={editedFields[label]} compact /></strong>
        </div>
      ))}
    </div>
  );
}
