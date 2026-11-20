import React, { useState } from 'react';

export default function ItemsView({
  table,
  items,
  loading,
  onRefreshItems,
  onOpenAddItem,
  onDeleteItem,
  onViewItem,
  onDeleteTable
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!table) {
    return (
      <div className="content-area">
        <div className="empty-state">
          <div className="empty-state-icon">⚡</div>
          <h3>Select or Create a Table</h3>
          <p>Choose an existing DynamoDB table from the sidebar, or create a new table to start storing records.</p>
          <button className="btn btn-primary" onClick={onOpenAddItem}>
            + Create Table
          </button>
        </div>
      </div>
    );
  }

  // Extract key schema
  const pk = table.KeySchema?.find((k) => k.KeyType === 'HASH')?.AttributeName;
  const sk = table.KeySchema?.find((k) => k.KeyType === 'RANGE')?.AttributeName;

  // Filter items
  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(term)
    );
  });

  // Extract dynamic table column headers
  const allKeys = Array.from(
    new Set(
      items.flatMap((item) => Object.keys(item))
    )
  );
  // Sort so PK and SK appear first
  const sortedColumns = [
    ...(pk ? [pk] : []),
    ...(sk && sk !== pk ? [sk] : []),
    ...allKeys.filter((k) => k !== pk && k !== sk)
  ];

  return (
    <main className="content-area">
      {/* Table Detail Banner */}
      <div className="table-header-card">
        <div className="table-title-group">
          <h2>
            <span>{table.TableName}</span>
            <span style={{ fontSize: '13px', background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px' }}>
              {table.TableStatus || 'ACTIVE'}
            </span>
          </h2>
          <div className="table-keys">
            {pk && (
              <span className="key-pill">
                Partition Key: <span>{pk}</span>
              </span>
            )}
            {sk && (
              <span className="key-pill">
                Sort Key: <span>{sk}</span>
              </span>
            )}
            <span className="key-pill">
              Count: <span>{items.length} items</span>
            </span>
          </div>
        </div>

        <div className="table-actions">
          <button className="btn btn-primary" onClick={onOpenAddItem}>
            + Add Item
          </button>
          <button className="btn btn-secondary" onClick={onRefreshItems} disabled={loading}>
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDeleteTable(table.TableName)}
            title="Delete table and all its contents"
          >
            Delete Table
          </button>
        </div>
      </div>

      {/* Items Container */}
      <div className="data-table-container">
        <div className="data-table-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Filter records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredItems.length} of {items.length} records
          </span>
        </div>

        <div className="table-scroll">
          {items.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No items in this table yet. Click <strong>"+ Add Item"</strong> above to insert a record!
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  {sortedColumns.map((col) => (
                    <th key={col}>
                      {col}
                      {col === pk && <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>(PK)</span>}
                      {col === sk && <span style={{ color: 'var(--warning)', marginLeft: '4px' }}>(SK)</span>}
                    </th>
                  ))}
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const itemKey = {
                    ...(pk && { [pk]: item[pk] }),
                    ...(sk && { [sk]: item[sk] })
                  };

                  return (
                    <tr key={idx}>
                      {sortedColumns.map((col) => {
                        const val = item[col];
                        let displayVal = '-';
                        if (val !== undefined) {
                          displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        }
                        return (
                          <td key={col}>
                            <div className="cell-val" title={displayVal}>
                              {displayVal}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: '6px' }}
                          onClick={() => onViewItem(item)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDeleteItem(table.TableName, itemKey)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
