import React, { useState } from 'react';

export default function CreateItemModal({ isOpen, onClose, table, onAddItem }) {
  const pk = table?.KeySchema?.find((k) => k.KeyType === 'HASH')?.AttributeName || 'id';
  const sk = table?.KeySchema?.find((k) => k.KeyType === 'RANGE')?.AttributeName;

  const [mode, setMode] = useState('json'); // 'json' or 'form'
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize JSON template when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const initial = {
        [pk]: `sample-${Date.now().toString().slice(-4)}`
      };
      if (sk) {
        initial[sk] = 'default';
      }
      initial.name = 'Sample Item';
      initial.createdAt = new Date().toISOString();
      setJsonText(JSON.stringify(initial, null, 2));
      setError('');
    }
  }, [isOpen, pk, sk]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let parsedItem;
    try {
      parsedItem = JSON.parse(jsonText);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      return;
    }

    if (!parsedItem[pk]) {
      setError(`Partition Key "${pk}" is required.`);
      return;
    }

    if (sk && !parsedItem[sk]) {
      setError(`Sort Key "${sk}" is required.`);
      return;
    }

    setLoading(true);
    try {
      await onAddItem(table.TableName, parsedItem);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Item to {table?.TableName}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Primary Keys required: <strong>{pk}</strong> (Partition Key)
              {sk && <span> and <strong>{sk}</strong> (Sort Key)</span>}.
            </div>

            {error && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '13px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Item Document (JSON format)</label>
              <textarea
                className="form-control"
                rows={12}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Inserting...' : 'Insert Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
