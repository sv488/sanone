import React, { useState, useEffect, useRef } from 'react';

export default function ReadingCard({ type, label, value, unit, sub, range, icon }) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current && value !== '—') {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 180);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value]);

  return (
    <div className={`sano-card sano-reading-card ${type}`}>
      <div className="rc-head">
        {icon}
        <div className="rc-label">{label}</div>
      </div>
      <div className="rc-num-row">
        <div className={`rc-value ${flash ? 'flash' : ''}`}>{value}</div>
        <div className="rc-unit">{unit}</div>
      </div>
      <div className="rc-sub">{sub}</div>
      <div className="rc-range">{range}</div>
    </div>
  );
}
