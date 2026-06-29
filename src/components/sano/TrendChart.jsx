import React, { useState } from 'react';
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SERIES = [
  { key: 'pressure', label: 'Pressure', color: '#2563eb' },
  { key: 'temp', label: 'Temp', color: '#e07a2a' },
  { key: 'humidity', label: 'Humidity', color: '#0891b2' }
];

export default function TrendChart({ readings }) {
  const [visible, setVisible] = useState({ pressure: true, temp: true, humidity: true });

  const data = readings.map(r => ({
    time: new Date(r.ts).toTimeString().slice(3, 8),
    pressure: r.pressure,
    temp: r.temp,
    humidity: r.humidity
  }));

  const toggle = (key) => setVisible(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="sano-card sano-chart-card">
      <div className="chart-top">
        <div className="chart-label">Last 60 readings</div>
        <div className="legend">
          {SERIES.map(s => (
            <div
              key={s.key}
              className={`legend-chip ${visible[s.key] ? 'on' : ''}`}
              onClick={() => toggle(s.key)}
            >
              <div className="l-dot" style={{ background: s.color }}></div>
              {s.label}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: 0 }}>
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`sano-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,107,0.07)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'rgba(27,58,107,0.25)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(27,58,107,0.3)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(27,58,107,0.12)',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 16px rgba(27,58,107,0.12)'
            }}
          />
          {SERIES.map(s => visible[s.key] && (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#sano-grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, fill: s.color, stroke: 'rgba(255,255,255,0.9)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
