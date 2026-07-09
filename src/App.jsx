import { useState } from "react";
import { caseData } from "./data/caseData";
import Header from "./components/Header";
import EventSummary from "./components/EventSummary";
import MedicalTimeline from "./components/MedicalTimeline";
import ExpertOpinions from "./components/ExpertOpinions";
import DisabilityMatrix from "./components/DisabilityMatrix";
import DocumentsPanel from "./components/DocumentsPanel";
import GapsPanel from "./components/GapsPanel";
import SourceModal from "./components/SourceModal";
import ReportSection from "./components/ReportSection";
import GeneralDetails from "./components/GeneralDetails";

const initialOpen = new Set(["event", "timeline", "experts", "disability"]);

export default function App() {
  const [openSections, setOpenSections] = useState(initialOpen);
  const [modalSource, setModalSource] = useState(null);

  const toggleSection = (id) => {
    const next = new Set(openSections);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenSections(next);
  };

  return (
    <div className="app-shell">
      <Header meta={caseData.caseMeta} productName={caseData.productName} />

      <main className="report-workspace">
        <section className="report-section fixed-section" id="section-general">
          <div className="fixed-section-head">
            <span className="section-letter">1</span>
            <strong>פרטים כלליים</strong>
          </div>
          <div className="report-section-body">
            <GeneralDetails details={caseData.generalDetails} />
          </div>
        </section>

        <section className="accordion-stack" aria-label="סעיפי סיכום תיק">
          <ReportSection
            id="event"
            number="2"
            title="נסיבות האירוע"
            summary={caseData.eventSummary.short}
            sourceHint="2 מקורות"
            open={openSections.has("event")}
            onToggle={toggleSection}
          >
            <EventSummary event={caseData.eventSummary} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="timeline"
            number="3"
            title="סיכום רפואי כרונולוגי"
            summary="רשימת מסמכים ואירועים רפואיים לפי סדר תאריכים."
            open={openSections.has("timeline")}
            onToggle={toggleSection}
          >
            <MedicalTimeline events={caseData.timeline} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="experts"
            number="4"
            title="חוות דעת מומחים"
            summary="חוות דעת נפרדות עם אחוזי נכות ומקור."
            open={openSections.has("experts")}
            onToggle={toggleSection}
          >
            <ExpertOpinions experts={caseData.experts} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="disability"
            number="5"
            title="טבלת הערכות נכות"
            summary="השוואת הערכות נכות לפי תחומים וגורמים."
            open={openSections.has("disability")}
            onToggle={toggleSection}
          >
            <DisabilityMatrix rows={caseData.disabilityMatrix} />
          </ReportSection>

          <ReportSection
            id="gaps"
            number="6"
            title="סתירות ופערים"
            summary="פערים מהותיים בלבד, ללא הכרעה בין מקורות."
            open={openSections.has("gaps")}
            onToggle={toggleSection}
          >
            <GapsPanel gaps={caseData.gaps} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="documents"
            number="7"
            title="מסמכים שנקראו"
            summary="טבלת מסמכים קומפקטית ופתיחת מקור."
            open={openSections.has("documents")}
            onToggle={toggleSection}
          >
            <DocumentsPanel documents={caseData.documents} onSource={setModalSource} />
          </ReportSection>
        </section>
      </main>

      <footer className="ai-disclaimer">
        ⚠️ סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.
      </footer>

      <SourceModal source={modalSource} onClose={() => setModalSource(null)} />
    </div>
  );
}
