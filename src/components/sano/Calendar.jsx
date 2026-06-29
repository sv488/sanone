import React from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['S','M','T','W','T','F','S'];

export default function Calendar({ cY, cM, onPrev, onNext, dayData, selK, onSelectDay }) {
  const today = new Date();
  const firstDay = new Date(cY, cM, 1).getDay();
  const daysInMonth = new Date(cY, cM + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const dk = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === cY && today.getMonth() === cM && today.getDate() === d;
    const isFuture = new Date(cY, cM, d) > today;
    const hasData = !!(dayData[dk] && dayData[dk].pressure.length > 0);
    cells.push({ d, dk, isToday, isFuture, hasData });
  }

  return (
    <>
      <div className="cal-hdr">
        <div className="cal-title">{MONTHS[cM]} {cY}</div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={onPrev}>‹</button>
          <button className="cal-nav-btn" onClick={onNext}>›</button>
        </div>
      </div>
      <div className="cal-days-header">
        {DOW.map((d, i) => <div key={i} className="cal-dh">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) => {
          if (cell.empty) return <div key={i} className="cal-day empty"></div>;
          return (
            <div
              key={i}
              className={`cal-day${cell.isToday ? ' today' : ''}${cell.isFuture ? ' future' : ''}${cell.hasData ? ' has-data' : ''}${selK === cell.dk ? ' selected' : ''}`}
              onClick={() => !cell.isFuture && onSelectDay(cell.dk)}
            >
              <div className="cal-dn">{cell.d}</div>
              {cell.hasData && (
                <div className="cal-dots">
                  {dayData[cell.dk].pressure.length > 0 && <div className="cal-dot" style={{ background: '#2563eb' }}></div>}
                  {dayData[cell.dk].temp.length > 0 && <div className="cal-dot" style={{ background: '#e07a2a' }}></div>}
                  {dayData[cell.dk].humidity.length > 0 && <div className="cal-dot" style={{ background: '#0891b2' }}></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
