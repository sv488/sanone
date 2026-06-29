import React, { useState } from 'react';

const CONN_LABELS = {
  idle: 'Ready',
  scanning: 'Searching…',
  connecting: 'Connecting…',
  connected: 'Connected',
  streaming: 'Connected',
  disconnected: 'Not connected',
  adapter_off: 'Bluetooth is off',
  error: 'Connection error'
};

export default function DeviceTab({ connectionState, deviceAddress, motorOn, wsUrl, onWsUrlChange, lastUpdate }) {
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(wsUrl);

  const handleSave = () => {
    onWsUrlChange(urlInput.trim());
    setEditing(false);
  };

  return (
    <>
      <div className="sano-sec-label">My device</div>
      <div className="sano-card sano-info-card">
        <div className="info-row"><div className="ir-label">Device name</div><div className="ir-val">SanoOne</div></div>
        <div className="info-row"><div className="ir-label">Connection</div><div className="ir-val">{CONN_LABELS[connectionState] || connectionState}</div></div>
        <div className="info-row"><div className="ir-label">Bluetooth ID</div><div className="ir-val">{deviceAddress || '—'}</div></div>
        <div className="info-row"><div className="ir-label">Sensors</div><div className="ir-val">MPRLS · AHT20 · TMP119</div></div>
        <div className="info-row"><div className="ir-label">Pump status</div><div className="ir-val">{motorOn ? 'Running' : 'Off'}</div></div>
        <div className="info-row"><div className="ir-label">Last updated</div><div className="ir-val">{lastUpdate || '—'}</div></div>
      </div>

      <div className="sano-sec-label">Connection settings</div>
      <div className="sano-card sano-info-card">
        <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div className="ir-label">WebSocket URL</div>
          {editing ? (
            <div style={{ width: '100%', display: 'flex', gap: 8 }}>
              <input
                className="ws-input"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="ws://10.101.0.155:8765"
                autoFocus
              />
              <button onClick={handleSave} style={{ flexShrink: 0, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#2563c8', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
            </div>
          ) : (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="ir-val" style={{ textAlign: 'left' }}>{wsUrl}</div>
              <button onClick={() => { setUrlInput(wsUrl); setEditing(true); }} style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(27,58,107,0.12)', background: 'rgba(255,255,255,0.5)', color: '#3d5c7a', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Edit</button>
            </div>
          )}
        </div>
      </div>

      <div className="sano-sec-label">Sensor details</div>
      <div className="sano-card sano-info-card">
        <div className="info-row"><div className="ir-label">MPRLS</div><div className="ir-val">Pressure · 0–25 PSI</div></div>
        <div className="info-row"><div className="ir-label">AHT20</div><div className="ir-val">Temp & Humidity</div></div>
        <div className="info-row"><div className="ir-label">TMP119</div><div className="ir-val">Temp ±0.03°C</div></div>
      </div>
    </>
  );
}
