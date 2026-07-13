import pulseLogo from "../assets/pulse-logo.png";

export const PULSE_NAME = "PULSE";
export const PULSE_FULL_NAME = "Personal Injury Unified Liability Summary & Evaluation";
export { pulseLogo };

export default function PulseBrand({ variant = "header" }) {
  return (
    <div className={`pulse-brand pulse-brand--${variant}`}>
      <img src={pulseLogo} alt="PULSE logo" />
      <div className="pulse-brand-copy">
        <span className="pulse-brand-name">{PULSE_NAME}</span>
        <span className="pulse-brand-subtitle">{PULSE_FULL_NAME}</span>
      </div>
    </div>
  );
}
