import React from 'react';

export default function Navbar({ health, onSeedData, onRefresh, seeding }) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 2c4.96 0 8 1.63 8 2.5S16.96 9 12 9s-8-1.63-8-2.5S7.04 4 12 4zm8 13.5c0 .87-3.04 2.5-8 2.5s-8-1.63-8-2.5v-2.34c1.94 1.15 4.88 1.84 8 1.84s6.06-.69 8-1.84v2.34zm0-4.5c0 .87-3.04 2.5-8 2.5s-8-1.63-8-2.5v-2.34c1.94 1.15 4.88 1.84 8 1.84s6.06-.69 8-1.84v2.34z"/>
          </svg>
        </div>
        <div className="brand-title">DynamoDB Studio</div>
        <div className="brand-badge">AWS Emulator</div>
      </div>

      <div className="nav-actions">
        {health ? (
          <div className={`status-badge ${health.status}`}>
            <span className="status-dot"></span>
            <span>
              {health.status === 'connected'
                ? `Connected (${health.tablesCount} tables)`
                : 'Disconnected'}
            </span>
          </div>
        ) : (
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>Connecting...</span>
          </div>
        )}

        <button
          className="btn btn-secondary"
          onClick={onSeedData}
          disabled={seeding}
          title="Create sample Products table with 5 items"
        >
          {seeding ? 'Seeding...' : '⚡ Seed Sample Data'}
        </button>

        <button className="btn btn-secondary" onClick={onRefresh} title="Refresh tables and connection">
          ↻ Refresh
        </button>
      </div>
    </header>
  );
}
