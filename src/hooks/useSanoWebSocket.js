import { useRef, useState, useEffect, useCallback } from 'react';

const PSI_TO_MMHG = 51.7149;

export function useSanoWebSocket(wsUrl) {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const [connectionState, setConnectionState] = useState('disconnected');
  const [deviceAddress, setDeviceAddress] = useState(null);
  const [motorOn, setMotorOn] = useState(false);
  const [lastReading, setLastReading] = useState(null);

  const connect = useCallback(() => {
    if (!wsUrl) return;
    // Close any existing connection
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState('connected');
      };

      ws.onclose = () => {
        setConnectionState('disconnected');
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {};

      ws.onmessage = (e) => {
        let m;
        try { m = JSON.parse(e.data); } catch { return; }

        if (m.type === 'status') {
          setConnectionState(m.state);
        } else if (m.type === 'device') {
          setDeviceAddress(m.address);
        } else if (m.type === 'reading') {
          // If pressure is in PSI range (0-25 for MPRLS), convert to mmHg
          const rawP = m.pressure;
          const pressure = rawP <= 25 ? rawP * PSI_TO_MMHG : rawP;
          setLastReading({
            pressure,
            temp: m.temp,
            humidity: m.humidity,
            ts: m.ts || Date.now()
          });
        } else if (m.type === 'motor_ack') {
          setMotorOn(m.state === 'on');
        }
      };
    } catch (err) {
      reconnectTimer.current = setTimeout(connect, 3000);
    }
  }, [wsUrl]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMotor = useCallback((state) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({ type: 'motor', state }));
    }
  }, []);

  return { connectionState, deviceAddress, motorOn, lastReading, sendMotor };
}
