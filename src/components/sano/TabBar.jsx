import React from 'react';

const TABS = [
  {
    id: 'live',
    label: 'Live',
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  },
  {
    id: 'history',
    label: 'History',
    icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
  },
  {
    id: 'device',
    label: 'Device',
    icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
  }
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="sano-tab-bar">
      <div className="sano-tab-bar-inner">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sano-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {tab.icon}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
