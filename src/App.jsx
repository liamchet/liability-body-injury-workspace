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
import EditModal from "./components/EditModal";

const initialOpen = new Set(["general", "event"]);

export default function App() {
  const [openSections, setOpenSections] = useState(initialOpen);
  const [modalSource, setModalSource] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [generalDetails, setGeneralDetails] = useState(caseData.generalDetails);
  const [eventSummary, setEventSummary] = useState(caseData.eventSummary);
  const [timeline, setTimeline] = useState(caseData.timeline);
  const [experts, setExperts] = useState(caseData.experts);
  const [disabilityMatrix, setDisabilityMatrix] = useState(caseData.disabilityMatrix);
  const [gaps, setGaps] = useState(caseData.gaps);

  const toggleSection = (id) => {
    const next = new Set(openSections);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenSections(next);
  };

  return (
    <div className="app-shell">
      <Header meta={caseData.caseMeta} productName={caseData.productName} />

      <main className="report-workspace">
        <section className="accordion-stack" aria-label="סעיפי סיכום תיק">
          <ReportSection
            id="general"
            icon="●"
            title="פרטים כלליים"
            open={openSections.has("general")}
            onToggle={toggleSection}
            actions={
              <button
                className="icon-action"
                title="ערוך פרטים כלליים"
                aria-label="ערוך פרטים כלליים"
                onClick={() =>
                  setEditModal({
                    title: "עריכת פרטים כלליים",
                    fields: generalDetails.map(([label]) => ({ name: label, label, type: "textarea", rows: 2 })),
                    initialValues: Object.fromEntries(generalDetails),
                    onSave: (values) => {
                      setGeneralDetails(generalDetails.map(([label]) => [label, values[label] || ""]));
                      setEditModal(null);
                    },
                  })
                }
              >
                ✎
              </button>
            }
          >
            <GeneralDetails details={generalDetails} />
          </ReportSection>

          <ReportSection
            id="event"
            icon="◔"
            title="נסיבות האירוע"
            summary={eventSummary.short}
            open={openSections.has("event")}
            onToggle={toggleSection}
          >
            <EventSummary event={eventSummary} onSource={setModalSource} onUpdate={setEventSummary} />
          </ReportSection>

          <ReportSection
            id="timeline"
            icon="↕"
            title="סיכום רפואי כרונולוגי"
            summary="אירועים רפואיים מרכזיים לפי סדר תאריכים."
            open={openSections.has("timeline")}
            onToggle={toggleSection}
            actions={
              <button
                className="text-action"
                onClick={() => setTimeline((items) => [
                  ...items,
                  {
                    id: Date.now(),
                    date: "",
                    title: "אירוע רפואי חדש",
                    summary: "סיכום קצר לעריכה",
                    full: "סיכום מלא לעריכה",
                    source: { title: "מקור חדש", date: "", type: "מסמך מקור", content: "תוכן מקור לדוגמה." },
                  },
                ])}
              >
                הוסף אירוע / מסמך רפואי
              </button>
            }
          >
            <MedicalTimeline events={timeline} setEvents={setTimeline} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="experts"
            icon="✎"
            title="חוות דעת מומחים"
            summary="קביעות מומחים ואחוזי נכות."
            open={openSections.has("experts")}
            onToggle={toggleSection}
          >
            <ExpertOpinions experts={experts} setExperts={setExperts} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="disability"
            icon="%"
            title="טבלת הערכות נכות"
            open={openSections.has("disability")}
            onToggle={toggleSection}
          >
            <DisabilityMatrix rows={disabilityMatrix} setRows={setDisabilityMatrix} />
          </ReportSection>

          <ReportSection
            id="gaps"
            icon="!"
            title="סתירות ופערים"
            summary="פערים מהותיים בלבד, ללא הכרעה בין מקורות."
            open={openSections.has("gaps")}
            onToggle={toggleSection}
            actions={
              <button
                className="text-action"
                onClick={() =>
                  setEditModal({
                    title: "הוספת פער",
                    fields: [
                      { name: "topic", label: "נושא הפער" },
                      { name: "positionA", label: "עמדה א׳" },
                      { name: "sourceA", label: "מקור א׳" },
                      { name: "whatA", label: "הסבר מקור א׳", type: "textarea", rows: 2 },
                      { name: "positionB", label: "עמדה ב׳" },
                      { name: "sourceB", label: "מקור ב׳" },
                      { name: "whatB", label: "הסבר מקור ב׳", type: "textarea", rows: 2 },
                      { name: "detail", label: "סיכום מורחב של הפער", type: "textarea", rows: 4 },
                    ],
                    initialValues: {
                      topic: "",
                      positionA: "",
                      sourceA: "",
                      whatA: "",
                      positionB: "",
                      sourceB: "",
                      whatB: "",
                      detail: "",
                    },
                    onSave: (values) => {
                      setGaps((items) => [
                        ...items,
                        {
                          topic: values.topic || "פער חדש",
                          positionA: values.positionA || "עמדה א׳",
                          positionB: values.positionB || "עמדה ב׳",
                          detail: values.detail || "",
                          sourceA: { title: values.sourceA || "מקור א׳", date: "", type: "מקור", content: values.whatA || "" },
                          whatA: values.whatA || "",
                          sourceB: { title: values.sourceB || "מקור ב׳", date: "", type: "מקור", content: values.whatB || "" },
                          whatB: values.whatB || "",
                        },
                      ]);
                      setEditModal(null);
                    },
                  })
                }
              >
                הוסף פער
              </button>
            }
          >
            <GapsPanel gaps={gaps} onSource={setModalSource} />
          </ReportSection>

          <ReportSection
            id="documents"
            icon="▤"
            title="מסמכים שנקראו"
            summary="טבלת מסמכים ומקורות לחיצים."
            open={openSections.has("documents")}
            onToggle={toggleSection}
          >
            <DocumentsPanel documents={caseData.documents} onSource={setModalSource} />
          </ReportSection>
        </section>
      </main>

      <footer className="ai-disclaimer">
        סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.
      </footer>

      <SourceModal source={modalSource} onClose={() => setModalSource(null)} />
      {editModal && (
        <EditModal
          {...editModal}
          onCancel={() => setEditModal(null)}
        />
      )}
    </div>
  );
}
