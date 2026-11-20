import React from 'react';

export default function TableList({ tables, activeTable, onSelectTable, onOpenCreateModal }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Tables ({tables.length})</span>
        <button className="btn btn-primary btn-sm" onClick={onOpenCreateModal}>
          + New Table
        </button>
      </div>

      <ul className="table-list">
        {tables.length === 0 ? (
          <li style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No tables found. Click "+ New Table" or "Seed Sample Data" above!
          </li>
        ) : (
          tables.map((tbl) => (
            <li
              key={tbl.TableName}
              className={`table-item ${activeTable?.TableName === tbl.TableName ? 'active' : ''}`}
              onClick={() => onSelectTable(tbl)}
            >
              <div className="table-item-name">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z"/>
                  <path d="M2 12h20"/>
                  <path d="M2 7h20"/>
                  <path d="M2 17h20"/>
                </svg>
                <span>{tbl.TableName}</span>
              </div>
              <span className="table-item-count">{tbl.ItemCount ?? 0}</span>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
