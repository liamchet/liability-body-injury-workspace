import { useCallback, useMemo, useState } from "react";
import { caseData } from "#case-data";
import AuditTrailDrawer from "./components/AuditTrailDrawer";
import DamagesDrawer from "./components/DamagesDrawer";
import DisabilityMatrix from "./components/DisabilityMatrix";
import DocumentDetailViewer from "./components/DocumentDetailViewer";
import DocumentsPanel from "./components/DocumentsPanel";
import EditModal from "./components/EditModal";
import EventSummary from "./components/EventSummary";
import ExpertOpinions from "./components/ExpertOpinions";
import ExportActions from "./components/ExportActions";
import FeedbackControl from "./components/FeedbackControl";
import FutureRecommendations from "./components/FutureRecommendations";
import GapsPanel from "./components/GapsPanel";
import GeneralDetails from "./components/GeneralDetails";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import MedicalTimeline from "./components/MedicalTimeline";
import PulseBrand from "./components/PulseBrand";
import ReportSection from "./components/ReportSection";
import { parseConfidence } from "./components/ReadabilityIndicator";

const initialOpen = new Set(["general", "event"]);
const currentUser = "מיישב תביעה";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openSections, setOpenSections] = useState(initialOpen);
  const [activeDocument, setActiveDocument] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [generalDetails, setGeneralDetails] = useState(caseData.generalDetails);
  const [generalEditedFields, setGeneralEditedFields] = useState({});
  const [eventSummary, setEventSummary] = useState(caseData.eventSummary);
  const [timeline, setTimeline] = useState(caseData.timeline);
  const [experts, setExperts] = useState(caseData.experts);
  const [gaps, setGaps] = useState(caseData.gaps);
  const [documents, setDocuments] = useState(() => caseData.documents.map((doc, index) => ({ ...doc, id: doc.id || `document-${index + 1}` })));
  const [auditEntries, setAuditEntries] = useState([]);
  const [damagesOpen, setDamagesOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const addAudit = useCallback((entry) => {
    setAuditEntries((items) => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toLocaleString("he-IL"),
      user: currentUser,
      action: entry.action,
      section: entry.section,
      item: entry.item || "",
      field: entry.field || "",
      previousValue: String(entry.previousValue ?? ""),
      newValue: String(entry.newValue ?? ""),
    }, ...items]);
  }, []);

  const toggleSection = (id) => setOpenSections((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const getDocumentMeta = useCallback((source) => {
    if (!source) return {};
    const doc = documents.find((item) => item.source === source || item.source?.title === source.title || item.name === source.title);
    const confidence = parseConfidence(doc?.extraction);
    return doc ? {
      documentId: doc.id,
      extractionConfidence: doc.extraction,
      inclusionStatus: confidence > 85 && doc.included !== "לא" ? "full" : confidence >= 60 && doc.included !== "לא" ? "partial" : "excluded",
      manuallyReviewed: doc.manuallyReviewed,
      reviewMetadata: doc.reviewMetadata,
    } : {};
  }, [documents]);

  const openDocument = useCallback((source = {}, context = {}) => {
    const metadata = getDocumentMeta(source);
    setActiveDocument({
      id: source.id || context.id || `${source.title}-${source.date}`,
      documentId: context.documentId || metadata.documentId,
      title: context.title || source.title || "מסמך מקור",
      date: context.date || source.date || "",
      type: context.type || source.type || "מסמך מקור",
      shortSummary: context.shortSummary || source.shortSummary || context.aiSummary || source.content,
      aiSummary: context.aiSummary || source.aiSummary || source.shortSummary || source.content,
      fullSummary: context.fullSummary || source.fullSummary || source.content || context.aiSummary,
      sourcePreviewUrl: context.sourcePreviewUrl || source.sourcePreviewUrl,
      sourcePreviewUrls: context.sourcePreviewUrls || source.sourcePreviewUrls,
      sourceFileType: context.sourceFileType || source.sourceFileType,
      extractionConfidence: context.extractionConfidence || metadata.extractionConfidence || source.extractionConfidence,
      inclusionStatus: context.inclusionStatus || metadata.inclusionStatus,
      manuallyReviewed: context.manuallyReviewed ?? metadata.manuallyReviewed,
      reviewMetadata: context.reviewMetadata || metadata.reviewMetadata,
      disabilityBreakdown: context.disabilityBreakdown || source.disabilityBreakdown,
      temporaryDisability: context.temporaryDisability || source.temporaryDisability,
      permanentDisability: context.permanentDisability || source.permanentDisability,
      netDisability: context.netDisability || source.netDisability,
      totalDisability: context.totalDisability || source.totalDisability,
      editMetadata: context.editMetadata || source.editMetadata,
    });
  }, [getDocumentMeta]);

  const approveDocument = useCallback((documentId) => {
    const doc = documents.find((item) => item.id === documentId);
    const confidence = parseConfidence(doc?.extraction);
    if (!doc || confidence < 60 || confidence > 85 || doc.manuallyReviewed) return;
    const timestamp = new Date().toLocaleString("he-IL");
    const reviewMetadata = { reviewedBy: currentUser, reviewedAt: timestamp };
    setDocuments((items) => items.map((item) => item.id === documentId ? { ...item, manuallyReviewed: true, reviewMetadata } : item));
    setActiveDocument((current) => current?.documentId === documentId ? { ...current, manuallyReviewed: true, reviewMetadata } : current);
    addAudit({ action: "אישור קריאת מסמך", section: "מסמכים שנקראו", item: doc.name, field: "סטטוס בדיקה", previousValue: "טרם נבדק ידנית", newValue: `נבדק ידנית על ידי ${currentUser} בתאריך ${timestamp}` });
  }, [addAudit, documents]);

  const lowReadabilityCount = useMemo(() => documents.filter((doc) => parseConfidence(doc.extraction) < 60).length, [documents]);
  const feedback = <FeedbackControl />;

  const openGeneralEdit = () => setEditModal({
    title: "עריכת פרטים כלליים",
    fields: generalDetails.map(([label]) => ({ name: label, label, type: "textarea", rows: 2 })),
    initialValues: Object.fromEntries(generalDetails),
    editedFields: generalEditedFields,
    onSave: (values) => {
      const timestamp = new Date().toLocaleString("he-IL");
      const nextMetadata = { ...generalEditedFields };
      generalDetails.forEach(([label, previousValue]) => {
        if (String(previousValue) !== String(values[label] || "")) {
          addAudit({ action: "עריכה", section: "פרטים כלליים", item: label, field: label, previousValue, newValue: values[label] });
          nextMetadata[label] = { editedBy: currentUser, editedAt: timestamp, originalValue: generalEditedFields[label]?.originalValue || previousValue };
        }
      });
      setGeneralDetails(generalDetails.map(([label]) => [label, values[label] || ""]));
      setGeneralEditedFields(nextMetadata);
      setEditModal(null);
    },
  });

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-shell">
      <Header meta={caseData.caseMeta} onOpenAudit={() => setAuditOpen(true)} auditCount={auditEntries.length} />
      <div className={`body-workspace ${damagesOpen ? "is-damages-open" : ""}`}>
        <DamagesDrawer open={damagesOpen} onOpen={() => setDamagesOpen(true)} onClose={() => setDamagesOpen(false)} meta={caseData.caseMeta} />
        <div className="claim-content-shell">
          <main className="report-workspace">
            <div className="print-brand"><PulseBrand variant="print" /></div>
            <section className="accordion-stack" aria-label="סעיפי סיכום תיק">
          <ReportSection id="general" icon="●" title="פרטים כלליים" open={openSections.has("general")} onToggle={toggleSection} actions={<><button className="icon-action" title="ערוך פרטים כלליים" aria-label="ערוך פרטים כלליים" onClick={openGeneralEdit}>✎</button>{feedback}</>}>
            <GeneralDetails details={generalDetails} editedFields={generalEditedFields} />
          </ReportSection>
          <ReportSection id="event" icon="◔" title="נסיבות האירוע" summary={eventSummary.short} open={openSections.has("event")} onToggle={toggleSection} actions={feedback}>
            <EventSummary event={eventSummary} onSource={openDocument} onUpdate={setEventSummary} onAudit={addAudit} />
          </ReportSection>
          <ReportSection id="timeline" icon="↕" title="סיכום רפואי כרונולוגי" summary="ציר רפואי של מסמכי המקור" open={openSections.has("timeline")} onToggle={toggleSection} actions={feedback}>
            <MedicalTimeline events={timeline} setEvents={setTimeline} onSource={openDocument} onAudit={addAudit} getDocumentMeta={getDocumentMeta} />
          </ReportSection>
          <ReportSection id="experts" icon="✎" title="חוות דעת מומחים" summary="חוות דעת והערכות נכות" open={openSections.has("experts")} onToggle={toggleSection} actions={feedback}>
            <ExpertOpinions experts={experts} setExperts={setExperts} onSource={openDocument} onAudit={addAudit} getDocumentMeta={getDocumentMeta} />
            <DisabilityMatrix rows={caseData.disabilityMatrix} experts={experts} onSource={openDocument} />
          </ReportSection>
          <ReportSection id="gaps" icon="!" title="סתירות ופערים" summary="פערים מהותיים בין מקורות" open={openSections.has("gaps")} onToggle={toggleSection} actions={feedback}>
            <GapsPanel gaps={gaps} setGaps={setGaps} onSource={openDocument} onAudit={addAudit} />
          </ReportSection>
          <ReportSection id="documents" icon="▤" title="מסמכים שנקראו" summary="קריאות, מקורות וסטטוס בדיקה" open={openSections.has("documents")} onToggle={toggleSection} actions={lowReadabilityCount ? <span className="section-warning" title="מסמכים שלא נכללו עקב קריאות נמוכה">⚠ {lowReadabilityCount}</span> : null}>
            <DocumentsPanel documents={documents} setDocuments={setDocuments} onSource={openDocument} onAudit={addAudit} onApprove={approveDocument} />
          </ReportSection>
            </section>
            <FutureRecommendations />
            <ExportActions meta={caseData.caseMeta} details={generalDetails} event={eventSummary} timeline={timeline} experts={experts} matrix={caseData.disabilityMatrix} gaps={gaps} documents={documents} />
          </main>
          <footer className="ai-disclaimer">סיכום זה הופק באמצעות מערכת בינה מלאכותית (AI) ועלול להכיל טעויות. יש לבצע בדיקה ואימות של המידע מול המסמכים המקוריים לפני קבלת החלטה.</footer>
        </div>
      </div>
      {auditOpen && <AuditTrailDrawer entries={auditEntries} onClose={() => setAuditOpen(false)} />}
      <DocumentDetailViewer document={activeDocument} onClose={() => setActiveDocument(null)} onApprove={approveDocument} />
      {editModal && <EditModal {...editModal} onCancel={() => setEditModal(null)} />}
    </div>
  );
}
