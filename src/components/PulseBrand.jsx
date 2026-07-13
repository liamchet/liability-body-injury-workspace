import pulseLogo from "../assets/pulse-logo-full.png";

export const PULSE_NAME = "PULSE";
export const PULSE_FULL_NAME = "Personal Injury Unified Liability Summary & Evaluation";
export { pulseLogo };

export default function PulseBrand({ variant = "header" }) {
  return (
    <div className={`pulse-brand pulse-brand--${variant}`}>
      <img src={pulseLogo} alt="PULSE logo" />
    </div>
  );
}
