import React, { useState } from 'react';

export default function ViewItemModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Record Details (JSON)</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <pre
            style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '16px',
              borderRadius: 'var(--radius)',
              overflowX: 'auto',
              maxHeight: '400px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy JSON'}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
