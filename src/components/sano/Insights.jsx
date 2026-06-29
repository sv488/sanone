import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function InsightsTab({ averages }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const sess = await base44.entities.Session.filter({
          created_date: { $gte: start.toISOString() }
        }, '-created_date', 100);
        setSessions(sess);
      } catch (e) {
        setSessions([]);
      }
      setLoading(false);
    }
    fetchSessions();
  }, []);

  const pAvg = averages.n > 0 ? (averages.p / averages.n).toFixed(1) : '—';
  const tAvg = averages.n > 0 ? (averages.t / averages.n).toFixed(1) : '—';
  const hAvg = averages.n > 0 ? (averages.h / averages.n).toFixed(0) : '—';

  return (
    <>
      <div className="sano-sec-label">Session averages</div>
      <div className="sano-card" style={{ paddingBottom: 16 }}>
        <div className="ins-grid">
          <div className="ins-num">
            <div className="ins-lbl" style={{ color: '#2563eb' }}>Pressure</div>
            <div className="ins-val">{pAvg}</div>
            <div className="ins-unit">mmHg</div>
          </div>
          <div className="ins-num">
            <div className="ins-lbl" style={{ color: '#e07a2a' }}>Temperature</div>
            <div className="ins-val">{tAvg}</div>
            <div className="ins-unit">°C</div>
          </div>
          <div className="ins-num">
            <div className="ins-lbl" style={{ color: '#0891b2' }}>Humidity</div>
            <div className="ins-val">{hAvg}</div>
            <div className="ins-unit">% RH</div>
          </div>
        </div>
      </div>

      <div className="sano-sec-label">Pump sessions today</div>
      <div className="sano-card sano-info-card">
        {loading ? (
          <div className="info-row"><div className="ir-label">Loading…</div></div>
        ) : sessions.length === 0 ? (
          <div className="info-row"><div className="ir-label">No sessions recorded yet</div></div>
        ) : (
          sessions.map((s, i) => {
            const mm = Math.floor(s.duration_secs / 60), ss = s.duration_secs % 60;
            const t = new Date(s.created_date).toTimeString().slice(0, 5);
            return (
              <div className="info-row" key={s.id}>
                <div className="ir-label">Session {i + 1} · {t}</div>
                <div className="ir-val">{mm}m {ss}s</div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
