import { useMemo, useState } from "react";
import { caseData } from "./data/caseData";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import OverviewCards from "./components/OverviewCards";
import EventSummary from "./components/EventSummary";
import ClaimantProfile from "./components/ClaimantProfile";
import MedicalTimeline from "./components/MedicalTimeline";
import ExpertOpinions from "./components/ExpertOpinions";
import DisabilityMatrix from "./components/DisabilityMatrix";
import DocumentsPanel from "./components/DocumentsPanel";
import GapsPanel from "./components/GapsPanel";
import ProcessingStatus from "./components/ProcessingStatus";
import FutureRecommendations from "./components/FutureRecommendations";
import SourceModal from "./components/SourceModal";

const tabs = [
  { id: "overview", label: "תמונת מצב" },
  { id: "timeline", label: "רצף רפואי" },
  { id: "experts", label: "חוות דעת ונכות" },
  { id: "documents", label: "מסמכים" },
  { id: "gaps", label: "פערים וסתירות" },
  { id: "future", label: "הערכת סיכון והמלצה" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [modalSource, setModalSource] = useState(null);

  const criticalDocs = useMemo(
    () => caseData.documents.filter((doc) => ["נכלל", "חלקית"].includes(doc[4])).slice(0, 6),
    []
  );

  return (
    <div className="app-shell">
      <Header meta={caseData.caseMeta} productName={caseData.productName} />
      <main className="workspace">
        <OverviewCards cards={caseData.overview} onNavigate={setActiveTab} />
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" && (
          <section className="tab-grid overview-grid">
            <div className="main-column">
              <EventSummary event={caseData.eventSummary} onSource={setModalSource} />
              <MedicalTimeline
                compact
                events={caseData.timeline.slice(0, 6)}
                onSource={setModalSource}
              />
            </div>
            <aside className="side-column">
              <ClaimantProfile profile={caseData.claimantProfile} />
              <ProcessingStatus meta={caseData.caseMeta} documents={criticalDocs} />
            </aside>
          </section>
        )}

        {activeTab === "timeline" && (
          <MedicalTimeline events={caseData.timeline} onSource={setModalSource} />
        )}

        {activeTab === "experts" && (
          <section className="stack">
            <ExpertOpinions experts={caseData.experts} onSource={setModalSource} />
            <DisabilityMatrix rows={caseData.disabilityMatrix} />
          </section>
        )}

        {activeTab === "documents" && (
          <DocumentsPanel documents={caseData.documents} onSource={setModalSource} />
        )}

        {activeTab === "gaps" && <GapsPanel gaps={caseData.gaps} />}
        {activeTab === "future" && <FutureRecommendations />}
      </main>

      <footer className="ai-footer">
        ⚠️ סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.
      </footer>

      <SourceModal source={modalSource} onClose={() => setModalSource(null)} />
    </div>
  );
}
