import React from 'react';

export default function StatusBanner({ connectionState, lastReading }) {
  const isStreaming = connectionState === 'streaming';
  const title = isStreaming ? 'System stable' : 'System ready';
  const sub = isStreaming && lastReading
    ? `Pressure ${lastReading.pressure.toFixed(1)} mmHg · Temp ${lastReading.temp.toFixed(1)}°C · Humidity ${lastReading.humidity.toFixed(0)}%`
    : 'Waiting for device data…';

  return (
    <div className="sano-card sano-status-banner">
      <div className={`sb-icon-wrap ${!isStreaming ? 'warn' : ''}`}>🛡</div>
      <div className="sb-text">
        <div className="sb-title">{title}</div>
        <div className="sb-sub">{sub}</div>
      </div>
      <div className="sb-signal">
        <div className="sig-bar"></div>
        <div className="sig-bar"></div>
        <div className="sig-bar"></div>
        <div className="sig-bar"></div>
      </div>
    </div>
  );
}
