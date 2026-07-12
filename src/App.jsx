import { useState } from "react";
import { caseData } from "./data/caseData";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import FeedbackControl from "./components/FeedbackControl";
import FutureRecommendations from "./components/FutureRecommendations";
import ExportActions from "./components/ExportActions";
import EventSummary from "./components/EventSummary";
import MedicalTimeline from "./components/MedicalTimeline";
import ExpertOpinions from "./components/ExpertOpinions";
import DisabilityMatrix from "./components/DisabilityMatrix";
import DocumentsPanel from "./components/DocumentsPanel";
import GapsPanel from "./components/GapsPanel";
import SourceModal from "./components/SourceModal";
import ReportSection from "./components/ReportSection";
import GeneralDetails from "./components/GeneralDetails";
import EditModal from "./components/EditModal";

const initialOpen = new Set(["general", "event"]);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openSections, setOpenSections] = useState(initialOpen);
  const [modalSource, setModalSource] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [generalDetails, setGeneralDetails] = useState(caseData.generalDetails);
  const [eventSummary, setEventSummary] = useState(caseData.eventSummary);
  const [timeline, setTimeline] = useState(caseData.timeline);
  const [experts, setExperts] = useState(caseData.experts);
  const [gaps, setGaps] = useState(caseData.gaps);
  const toggleSection = (id) => setOpenSections((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const feedback = <FeedbackControl />;
  const generalEdit = <button className="icon-action" title="ערוך פרטים כלליים" aria-label="ערוך פרטים כלליים" onClick={() => setEditModal({ title: "עריכת פרטים כלליים", fields: generalDetails.map(([label]) => ({ name: label, label, type: "textarea", rows: 2 })), initialValues: Object.fromEntries(generalDetails), onSave: (values) => { setGeneralDetails(generalDetails.map(([label]) => [label, values[label] || ""])); setEditModal(null); } })}>✎</button>;

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return <div className="app-shell">
    <Header meta={caseData.caseMeta} productName={caseData.productName} />
    <main className="report-workspace"><section className="accordion-stack" aria-label="סעיפי סיכום תיק">
      <ReportSection id="general" icon="●" title="פרטים כלליים" open={openSections.has("general")} onToggle={toggleSection} actions={<>{generalEdit}{feedback}</>}><GeneralDetails details={generalDetails} /></ReportSection>
      <ReportSection id="event" icon="◔" title="נסיבות האירוע" summary={eventSummary.short} open={openSections.has("event")} onToggle={toggleSection} actions={feedback}><EventSummary event={eventSummary} onSource={setModalSource} onUpdate={setEventSummary} /></ReportSection>
      <ReportSection id="timeline" icon="↕" title="סיכום רפואי כרונולוגי" summary="לאחר התאונה תועדו פגיעות אגן, כתף ועמוד שדרה, לצד שיקום וחוות דעת לאורך השנים." open={openSections.has("timeline")} onToggle={toggleSection} actions={feedback}><MedicalTimeline events={timeline} setEvents={setTimeline} onSource={setModalSource} /></ReportSection>
      <ReportSection id="experts" icon="✎" title="חוות דעת מומחים" summary="קביעות מומחים והערכות נכות." open={openSections.has("experts")} onToggle={toggleSection} actions={feedback}><ExpertOpinions experts={experts} setExperts={setExperts} onSource={setModalSource} /><DisabilityMatrix rows={caseData.disabilityMatrix} experts={experts} onSource={setModalSource} /></ReportSection>
      <ReportSection id="gaps" icon="!" title="סתירות ופערים" summary="פערים מהותיים בין מקורות." open={openSections.has("gaps")} onToggle={toggleSection} actions={feedback}><GapsPanel gaps={gaps} setGaps={setGaps} onSource={setModalSource} /></ReportSection>
      <ReportSection id="documents" icon="▤" title="מסמכים שנקראו" summary="טבלת מסמכים ומקורות לחיצים." open={openSections.has("documents")} onToggle={toggleSection}><DocumentsPanel documents={caseData.documents} onSource={setModalSource} /></ReportSection>
    </section>
    <FutureRecommendations />
    <ExportActions meta={caseData.caseMeta} details={generalDetails} event={eventSummary} timeline={timeline} experts={experts} matrix={caseData.disabilityMatrix} gaps={gaps} documents={caseData.documents} />
    </main>
    <footer className="ai-disclaimer">סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.</footer>
    <SourceModal source={modalSource} onClose={() => setModalSource(null)} />
    {editModal && <EditModal {...editModal} onCancel={() => setEditModal(null)} />}
  </div>;
}
