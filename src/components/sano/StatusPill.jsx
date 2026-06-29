import React from 'react';

export default function StatusPill({ state, label }) {
  return (
    <div className={`sano-status-pill ${state || 'disconnected'}`}>
      <div className="s-dot"></div>
      <span>{label}</span>
    </div>
  );
}
