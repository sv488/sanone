import React, { useState, useRef, useEffect } from 'react';

const RING_C = 2 * Math.PI * 100; // r=100 → ≈628

export default function TimerCard({ motorOn, timerSecs, onMotorToggle }) {
  const [counting, setCounting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const runCountdown = () => {
    setCounting(true);
    let n = 3;
    const tick = () => {
      if (n === 0) {
        setCounting(false);
        setCountdown(null);
        onMotorToggle('on');
        return;
      }
      setCountdown(n);
      n--;
      timeoutRef.current = setTimeout(tick, 1000);
    };
    tick();
  };

  const handleClick = () => {
    if (counting) return;
    if (motorOn) {
      onMotorToggle('off');
    } else {
      runCountdown();
    }
  };

  const pct = Math.min(timerSecs / 1800, 1); // 30-min goal
  const offset = RING_C * (1 - pct);
  const m = Math.floor(timerSecs / 60);
  const s = timerSecs % 60;

  const subLabel = motorOn ? 'running' : timerSecs > 0 ? 'session complete' : 'ready';

  return (
    <div className={`sano-card sano-timer-card ${motorOn ? 'running' : ''}`}>
      <div className="session-badge">
        <div className="session-badge-dot"></div>
        <span className="session-badge-color">{motorOn ? 'Live session' : 'Ready'}</span>
      </div>

      <div className="ring-wrap">
        <svg className="ring-svg" viewBox="0 0 230 230">
          <defs>
            <linearGradient id="sano-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#1b3a6b" />
            </linearGradient>
          </defs>
          <circle cx="115" cy="115" r="100" fill="none" stroke="rgba(27,58,107,0.09)" strokeWidth="13" />
          <circle
            cx="115" cy="115" r="100" fill="none"
            stroke="url(#sano-ring-grad)" strokeWidth="13" strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 8px rgba(37,99,200,0.3))' }}
          />
        </svg>

        <div className="ring-center">
          <div className="ring-big">
            <span>{m}</span>
            <span className="unit">min</span>
          </div>
          <div className="ring-hms">{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</div>
          <div className="ring-sub">{subLabel}</div>
        </div>
      </div>

      <button
        className={`sano-btn-start ${motorOn ? 'stopping' : ''} ${counting ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        {counting ? (
          <span key={countdown} className="count-n" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', color: '#1b3a6b' }}>
            {countdown}
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {motorOn ? (
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="3" />
              </svg>
            ) : (
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
            <span>{motorOn ? 'Stop' : 'Start'}</span>
          </span>
        )}
      </button>
    </div>
  );
}
