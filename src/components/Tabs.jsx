export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <nav className="tabs" aria-label="אזורי עבודה">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "active" : ""}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
