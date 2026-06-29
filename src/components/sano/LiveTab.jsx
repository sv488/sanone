import React from 'react';
import TimerCard from '@/components/sano/TimerCard';
import ReadingCard from '@/components/sano/ReadingCard';
import StatusBanner from '@/components/sano/StatusBanner';
import TrendChart from '@/components/sano/TrendChart';

const PressureIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="1.8" />
    <path d="M8 15 Q10 9 12 12 Q14 9 16 15" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="12" cy="12" r="1.5" fill="#2563eb" />
  </svg>
);

const TempIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3a2 2 0 0 0-2 2v9.17A4 4 0 1 0 14 14V5a2 2 0 0 0-2-2z" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="2.5" fill="#f59e0b" />
    <line x1="14" y1="8" x2="16" y2="8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="11" x2="16" y2="11" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HumidityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 C12 3 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 3 12 3z" fill="#0891b2" opacity="0.85" />
  </svg>
);

function fmtRange(mm) {
  if (!mm || mm.min === null) return '';
  return `${mm.min.toFixed(1)} – ${mm.max.toFixed(1)}`;
}

export default function LiveTab({ readings, motorOn, timerSecs, onMotorToggle, connectionState, lastReading, minMax }) {
  const pVal = lastReading ? lastReading.pressure.toFixed(1) : '—';
  const tVal = lastReading ? lastReading.temp.toFixed(1) : '—';
  const hVal = lastReading ? lastReading.humidity.toFixed(0) : '—';

  return (
    <>
      <TimerCard motorOn={motorOn} timerSecs={timerSecs} onMotorToggle={onMotorToggle} />

      <div className="sano-sec-label">Current readings</div>
      <div className="sano-reading-row">
        <ReadingCard type="pressure" label="Pressure" value={pVal} unit="mmHg" sub="current reading" range={fmtRange(minMax?.pressure)} icon={<PressureIcon />} />
        <ReadingCard type="temp" label="Temperature" value={tVal} unit="°C" sub="within range" range={fmtRange(minMax?.temp)} icon={<TempIcon />} />
        <ReadingCard type="humidity" label="Humidity" value={hVal} unit="%" sub="relative humidity" range={fmtRange(minMax?.humidity)} icon={<HumidityIcon />} />
      </div>

      <StatusBanner connectionState={connectionState} lastReading={lastReading} />

      <div className="sano-sec-label">Trends</div>
      <TrendChart readings={readings} />
    </>
  );
}
