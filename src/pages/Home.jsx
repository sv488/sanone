import React, { useState, useEffect, useRef, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useSanoWebSocket } from '@/hooks/useSanoWebSocket';
import Wordmark from '@/components/sano/Wordmark';
import StatusPill from '@/components/sano/StatusPill';
import TabBar from '@/components/sano/TabBar';
import LiveTab from '@/components/sano/LiveTab';
import HistoryTab from '@/components/sano/HistoryTab';
import DeviceTab from '@/components/sano/DeviceTab';
import InsightsTab from '@/components/sano/InsightsTab';

const STATUS_MAP = {
  idle: 'Ready',
  scanning: 'Searching…',
  connecting: 'Connecting…',
  connected: 'Device found',
  streaming: 'Live',
  disconnected: 'Reconnecting…',
  adapter_off: 'Bluetooth is off',
  error: 'Connection error'
};

export default function Home() {
  const [wsUrl, setWsUrl] = useState(() => localStorage.getItem('sano_ws_url') || 'ws://10.101.0.155:8765');
  const { connectionState, deviceAddress, motorOn, lastReading, sendMotor } = useSanoWebSocket(wsUrl);

  const [activeTab, setActiveTab] = useState('live');
  const [readings, setReadings] = useState([]);
  const [timerSecs, setTimerSecs] = useState(0);
  const [insights, setInsights] = useState({ p: 0, t: 0, h: 0, n: 0 });
  const [lastUpdate, setLastUpdate] = useState(null);

  const timerSecsRef = useRef(0);
  const prevMotorRef = useRef(false);
  const batchRef = useRef([]);

  useEffect(() => { timerSecsRef.current = timerSecs; }, [timerSecs]);

  // Timer — runs while motor is on
  useEffect(() => {
    if (!motorOn) return;
    const iv = setInterval(() => {
      setTimerSecs(s => {
        const next = s + 1;
        timerSecsRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [motorOn]);

  // Motor state transition — save session on stop, reset on start
  useEffect(() => {
    if (prevMotorRef.current && !motorOn) {
      const dur = timerSecsRef.current;
      if (dur > 0) {
        base44.entities.Session.create({
          duration_secs: dur,
          started_at: new Date(Date.now() - dur * 1000).toISOString(),
          ended_at: new Date().toISOString()
        });
      }
      setTimerSecs(0);
      timerSecsRef.current = 0;
    }
    if (!prevMotorRef.current && motorOn) {
      setTimerSecs(0);
      timerSecsRef.current = 0;
    }
    prevMotorRef.current = motorOn;
  }, [motorOn]);

  // On new reading — update buffer, insights, queue for batch save
  useEffect(() => {
    if (!lastReading) return;

    setReadings(prev => [...prev.slice(-59), lastReading]);

    setInsights(prev => ({
      p: prev.p + lastReading.pressure,
      t: prev.t + lastReading.temp,
      h: prev.h + lastReading.humidity,
      n: prev.n + 1
    }));

    const time = new Date(lastReading.ts).toTimeString().slice(0, 8);
    setLastUpdate(time);

    batchRef.current.push({
      pressure: lastReading.pressure,
      temp: lastReading.temp,
      humidity: lastReading.humidity,
      reading_timestamp: new Date(lastReading.ts).toISOString()
    });
  }, [lastReading]);

  // Batch save readings every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (batchRef.current.length > 0) {
        const batch = batchRef.current;
        batchRef.current = [];
        try {
          await base44.entities.Reading.bulkCreate(batch);
        } catch (e) { /* silent */ }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save remaining readings on unmount
  useEffect(() => {
    return () => {
      if (batchRef.current.length > 0) {
        base44.entities.Reading.bulkCreate(batchRef.current);
      }
    };
  }, []);

  const minMax = useMemo(() => {
    if (readings.length === 0) return null;
    return {
      pressure: {
        min: Math.min(...readings.map(r => r.pressure)),
        max: Math.max(...readings.map(r => r.pressure))
      },
      temp: {
        min: Math.min(...readings.map(r => r.temp)),
        max: Math.max(...readings.map(r => r.temp))
      },
      humidity: {
        min: Math.min(...readings.map(r => r.humidity)),
        max: Math.max(...readings.map(r => r.humidity))
      }
    };
  }, [readings]);

  const handleWsUrlChange = (url) => {
    setWsUrl(url);
    localStorage.setItem('sano_ws_url', url);
  };

  const statusLabel = STATUS_MAP[connectionState] || connectionState;

  return (
    <>
      <header className="sano-header">
        <Wordmark />
        <StatusPill state={connectionState} label={statusLabel} />
      </header>

      <div className="sano-page">
        {activeTab === 'live' && (
          <LiveTab
            readings={readings}
            motorOn={motorOn}
            timerSecs={timerSecs}
            onMotorToggle={sendMotor}
            connectionState={connectionState}
            lastReading={lastReading}
            minMax={minMax}
          />
        )}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'device' && (
          <DeviceTab
            connectionState={connectionState}
            deviceAddress={deviceAddress}
            motorOn={motorOn}
            wsUrl={wsUrl}
            onWsUrlChange={handleWsUrlChange}
            lastUpdate={lastUpdate}
          />
        )}
        {activeTab === 'insights' && <InsightsTab averages={insights} />}
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
