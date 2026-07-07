import { useMemo, useState } from "react";
import { caseData } from "./data/caseData";
import Header from "./components/Header";
import OverviewCards from "./components/OverviewCards";
import EventSummary from "./components/EventSummary";
import MedicalTimeline from "./components/MedicalTimeline";
import ExpertOpinions from "./components/ExpertOpinions";
import DisabilityMatrix from "./components/DisabilityMatrix";
import DocumentsPanel from "./components/DocumentsPanel";
import GapsPanel from "./components/GapsPanel";
import SourceModal from "./components/SourceModal";
import ReportSection from "./components/ReportSection";
import GeneralDetails from "./components/GeneralDetails";

const initialOpen = new Set(["event", "disability", "experts"]);

export default function App() {
  const [openSections, setOpenSections] = useState(initialOpen);
  const [modalSource, setModalSource] = useState(null);

  const summaryCards = useMemo(
    () => caseData.overview.filter((card) => ["event", "disability", "experts", "medical", "gaps"].includes(card.id)),
    []
  );

  const toggleSection = (id) => {
    const next = new Set(openSections);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenSections(next);
  };

  const openSection = (id) => {
    setOpenSections((current) => new Set([...current, id]));
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-shell">
      <Header meta={caseData.caseMeta} productName={caseData.productName} />

      <main className="report-workspace">
        <section className="report-intro">
          <div>
            <span className="eyebrow">סיכום תיק נזקי גוף</span>
            <h1>מרחב עבודה חכם למיישב תביעות</h1>
            <p>
              תצוגה מובנית לפי סעיפי הדוח: עובדות, רצף רפואי, נכות, מומחים,
              פערים ומקורות. כל המידע בתצוגה אנונימי ומיועד לאימות מול מסמכי המקור.
            </p>
          </div>
          <div className="intro-status">
            <strong>{caseData.caseMeta.aiStatus}</strong>
            <span>עדכון אחרון: {caseData.caseMeta.lastAiUpdate}</span>
          </div>
        </section>

        <OverviewCards cards={summaryCards} onNavigate={openSection} />

        <section className="accordion-stack" aria-label="סעיפי סיכום תיק">
          <ReportSection
            id="general"
            letter="א"
            title="פרטים כלליים"
            summary="פרטי תיק אנונימיים, סוג התביעה ונתוני רקע תפקודיים."
            open={openSections.has("general")}
            onToggle={toggleSection}
          >
            <GeneralDetails meta={caseData.caseMeta} profile={caseData.claimantProfile} />
          </ReportSection>

          <ReportSection
            id="event"
            letter="ב"
            title="נסיבות האירוע"
            summary="תיאור קצר ומבוסס מקור של התאונה והפינוי הראשוני."
            open={openSections.has("event")}
            onToggle={toggleSection}
          >
            <EventSummary event={caseData.eventSummary} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="timeline"
            letter="ג"
            title="סיכום תיעוד רפואי כרונולוגי"
            summary="ציר זמן רפואי עם חיפוש, סינון ופתיחת מקורות."
            open={openSections.has("timeline")}
            onToggle={toggleSection}
          >
            <MedicalTimeline events={caseData.timeline} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="disability"
            letter="ד"
            title="הערכות נכות"
            summary="השוואת אחוזי נכות בין מומחים, מל״ל וחיזוי."
            open={openSections.has("disability")}
            onToggle={toggleSection}
          >
            <DisabilityMatrix rows={caseData.disabilityMatrix} />
          </ReportSection>

          <ReportSection
            id="experts"
            letter="ה"
            title="חוות דעת מומחים"
            summary="חוות הדעת המרכזיות והקביעות הרפואיות הבולטות."
            open={openSections.has("experts")}
            onToggle={toggleSection}
          >
            <ExpertOpinions experts={caseData.experts} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="gaps"
            letter="ו"
            title="סתירות / פערים מהותיים"
            summary="פערים מהותיים בלבד, ללא הכרעה או המלצה משפטית."
            open={openSections.has("gaps")}
            onToggle={toggleSection}
          >
            <GapsPanel gaps={caseData.gaps} />
          </ReportSection>

          <ReportSection
            id="documents"
            letter="ז"
            title="מסמכים שנקראו"
            summary="טבלת עיבוד מסמכים קומפקטית עם תצוגת מקור."
            open={openSections.has("documents")}
            onToggle={toggleSection}
          >
            <DocumentsPanel documents={caseData.documents} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="ai-note"
            letter="ח"
            title="הערת AI"
            summary="הבהרת שימוש במערכת וסימון אפיק עתידי קטן."
            open={openSections.has("ai-note")}
            onToggle={toggleSection}
          >
            <div className="ai-note-card">
              <p>
                סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות.
                יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.
              </p>
              <div className="future-mini">
                <strong>הערכת סיכון והמלצה</strong>
                <span>אפיק עתידי, לא פעיל בגרסה זו, ואינו מהווה המלצה לאישור או דחיית תביעה.</span>
              </div>
            </div>
          </ReportSection>
        </section>
      </main>

      <SourceModal source={modalSource} onClose={() => setModalSource(null)} />
    </div>
  );
}
