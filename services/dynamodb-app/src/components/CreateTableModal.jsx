import React, { useState } from 'react';

export default function CreateTableModal({ isOpen, onClose, onCreateTable }) {
  const [tableName, setTableName] = useState('');
  const [pkName, setPkName] = useState('id');
  const [pkType, setPkType] = useState('S');
  const [hasSortKey, setHasSortKey] = useState(false);
  const [skName, setSkName] = useState('');
  const [skType, setSkType] = useState('S');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableName.trim() || !pkName.trim()) return;

    setLoading(true);
    try {
      await onCreateTable({
        tableName: tableName.trim(),
        partitionKey: { name: pkName.trim(), type: pkType },
        sortKey: hasSortKey && skName.trim() ? { name: skName.trim(), type: skType } : null
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New DynamoDB Table</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Table Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Users, Orders, Inventory"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Partition Key (HASH)</label>
              <div className="form-row">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Attribute name (e.g. id, userId)"
                  value={pkName}
                  onChange={(e) => setPkName(e.target.value)}
                  style={{ flex: 2 }}
                  required
                />
                <select
                  className="form-control"
                  value={pkType}
                  onChange={(e) => setPkType(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="S">String (S)</option>
                  <option value="N">Number (N)</option>
                  <option value="B">Binary (B)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasSortKey}
                  onChange={(e) => setHasSortKey(e.target.checked)}
                />
                <span>Add Sort Key (RANGE) - Optional</span>
              </label>

              {hasSortKey && (
                <div className="form-row" style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Sort key (e.g. createdAt, category)"
                    value={skName}
                    onChange={(e) => setSkName(e.target.value)}
                    style={{ flex: 2 }}
                    required={hasSortKey}
                  />
                  <select
                    className="form-control"
                    value={skType}
                    onChange={(e) => setSkType(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="S">String (S)</option>
                    <option value="N">Number (N)</option>
                    <option value="B">Binary (B)</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Billing mode defaults to <strong>PAY_PER_REQUEST</strong> (On-Demand capacity) on AWS Emulator.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
