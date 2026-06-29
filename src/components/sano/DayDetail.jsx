import React from 'react';

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

export default function DayDetail({ dayKey, dayData, sessions }) {
  if (!dayKey) {
    return (
      <div className="day-detail-inner">
        <div className="dd-empty" style={{ paddingTop: '24px' }}>
          <div className="dd-empty-icon">📅</div>
          Select a date to see your session summary
        </div>
      </div>
    );
  }

  const [y, m, d] = dayKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const isToday = new Date().toDateString() === date.toDateString();
  const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  if (!dayData || dayData.pressure.length === 0) {
    return (
      <div className="day-detail-inner">
        <div className="dd-date">{isToday ? 'Today' : label.split(',')[0]}</div>
        <div className="dd-sub">{label}</div>
        <div className="dd-empty">
          <div className="dd-empty-icon">📭</div>
          No readings on this date
        </div>
      </div>
    );
  }

  const pV = dayData.pressure, tV = dayData.temp, hV = dayData.humidity;
  const pA = avg(pV), tA = avg(tV), hA = avg(hV);
  const sess = sessions || [];

  return (
    <div className="day-detail-inner">
      <div className="dd-date">{isToday ? 'Today' : label.split(',')[0]}</div>
      <div className="dd-sub">{label} · {pV.length} readings</div>
      <div className="dd-stats">
        <div className="dd-stat">
          <div className="dd-stat-lbl" style={{ color: '#2563eb' }}>Pressure</div>
          <div className="dd-stat-val">{pA.toFixed(1)}</div>
          <div className="dd-stat-unit">mmHg</div>
          <div className="dd-stat-rng">{Math.min(...pV).toFixed(1)} – {Math.max(...pV).toFixed(1)}</div>
          <div className="dd-bar"><div className="dd-fill" style={{ width: `${Math.min(100, (pA / 200) * 100).toFixed(1)}%`, background: '#2563eb' }}></div></div>
        </div>
        <div className="dd-stat">
          <div className="dd-stat-lbl" style={{ color: '#e07a2a' }}>Temperature</div>
          <div className="dd-stat-val">{tA.toFixed(1)}</div>
          <div className="dd-stat-unit">°C</div>
          <div className="dd-stat-rng">{Math.min(...tV).toFixed(1)} – {Math.max(...tV).toFixed(1)}</div>
          <div className="dd-bar"><div className="dd-fill" style={{ width: `${Math.min(100, ((tA + 10) / 60) * 100).toFixed(1)}%`, background: '#e07a2a' }}></div></div>
        </div>
        <div className="dd-stat">
          <div className="dd-stat-lbl" style={{ color: '#0891b2' }}>Humidity</div>
          <div className="dd-stat-val">{hA.toFixed(0)}</div>
          <div className="dd-stat-unit">% RH</div>
          <div className="dd-stat-rng">{Math.min(...hV).toFixed(0)} – {Math.max(...hV).toFixed(0)}</div>
          <div className="dd-bar"><div className="dd-fill" style={{ width: `${Math.min(100, hA).toFixed(1)}%`, background: '#0891b2' }}></div></div>
        </div>
      </div>
      <div className="dd-sessions-title">💊 Pump sessions</div>
      <div className="dd-sessions-body">
        {sess.length === 0
          ? 'No pump sessions on this date.'
          : sess.map((s, i) => {
            const mm = Math.floor(s.duration_secs / 60), ss = s.duration_secs % 60;
            const t = new Date(s.created_date).toTimeString().slice(0, 5);
            return <div key={s.id}>Session {i + 1} &nbsp;·&nbsp; {t} &nbsp;·&nbsp; <strong>{mm}m {ss}s</strong></div>;
          })
        }
      </div>
    </div>
  );
}
