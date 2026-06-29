import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Calendar from '@/components/sano/Calendar';
import DayDetail from '@/components/sano/DayDetail';

export default function HistoryTab() {
  const [cY, setCY] = useState(new Date().getFullYear());
  const [cM, setCM] = useState(new Date().getMonth());
  const [selK, setSelK] = useState(null);
  const [dayData, setDayData] = useState({});
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchMonth() {
      try {
        const start = new Date(cY, cM, 1);
        const end = new Date(cY, cM + 1, 1);
        const readings = await base44.entities.Reading.filter({
          created_date: { $gte: start.toISOString(), $lt: end.toISOString() }
        }, '-created_date', 5000);

        const byDay = {};
        readings.forEach(r => {
          const d = new Date(r.created_date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!byDay[key]) byDay[key] = { pressure: [], temp: [], humidity: [] };
          byDay[key].pressure.push(r.pressure);
          byDay[key].temp.push(r.temp);
          byDay[key].humidity.push(r.humidity);
        });
        setDayData(byDay);
      } catch (e) {
        setDayData({});
      }
    }
    fetchMonth();
  }, [cY, cM]);

  useEffect(() => {
    if (!selK) { setSessions([]); return; }
    async function fetchSessions() {
      try {
        const [y, m, d] = selK.split('-').map(Number);
        const start = new Date(y, m - 1, d);
        const end = new Date(y, m - 1, d + 1);
        const sess = await base44.entities.Session.filter({
          created_date: { $gte: start.toISOString(), $lt: end.toISOString() }
        }, '-created_date', 100);
        setSessions(sess);
      } catch (e) {
        setSessions([]);
      }
    }
    fetchSessions();
  }, [selK]);

  const handlePrev = () => {
    setCM(m => {
      if (m === 0) { setCY(y => y - 1); return 11; }
      return m - 1;
    });
  };
  const handleNext = () => {
    setCM(m => {
      if (m === 11) { setCY(y => y + 1); return 0; }
      return m + 1;
    });
  };

  return (
    <div className="sano-card" style={{ overflow: 'hidden' }}>
      <Calendar
        cY={cY}
        cM={cM}
        onPrev={handlePrev}
        onNext={handleNext}
        dayData={dayData}
        selK={selK}
        onSelectDay={setSelK}
      />
      <div className="dd-div"></div>
      <DayDetail dayKey={selK} dayData={selK ? dayData[selK] : null} sessions={sessions} />
    </div>
  );
}
