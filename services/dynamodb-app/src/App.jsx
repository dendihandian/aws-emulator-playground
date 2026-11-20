import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import TableList from './components/TableList.jsx';
import ItemsView from './components/ItemsView.jsx';
import CreateTableModal from './components/CreateTableModal.jsx';
import CreateItemModal from './components/CreateItemModal.jsx';
import ViewItemModal from './components/ViewItemModal.jsx';

export default function App() {
  const [health, setHealth] = useState(null);
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch health status
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ status: 'disconnected', endpoint: 'unknown', tablesCount: 0 });
    }
  }, []);

  // Fetch tables list
  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/tables');
      if (!res.ok) throw new Error('Failed to fetch tables');
      const data = await res.json();
      setTables(data.tables || []);

      // If active table still exists, update it; otherwise select first if available
      setActiveTable((curr) => {
        if (!curr && data.tables?.length > 0) return data.tables[0];
        const refreshed = data.tables?.find((t) => t.TableName === curr?.TableName);
        return refreshed || data.tables?.[0] || null;
      });
    } catch (err) {
      addToast(err.message, 'error');
    }
  }, []);

  // Fetch items for the active table
  const fetchItems = useCallback(async (tableName) => {
    if (!tableName) {
      setItems([]);
      return;
    }
    setLoadingItems(true);
    try {
      const res = await fetch(`/api/tables/${encodeURIComponent(tableName)}/items`);
      if (!res.ok) throw new Error(`Failed to scan table ${tableName}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchTables();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [checkHealth, fetchTables]);

  // Load items when active table changes
  useEffect(() => {
    if (activeTable?.TableName) {
      fetchItems(activeTable.TableName);
    } else {
      setItems([]);
    }
  }, [activeTable?.TableName, fetchItems]);

  // Handle table creation
  const handleCreateTable = async (newTableData) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTableData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create table');

      addToast(`Table "${newTableData.tableName}" created successfully!`);
      await fetchTables();
      setActiveTable(data.table || { TableName: newTableData.tableName });
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Handle table deletion
  const handleDeleteTable = async (tableName) => {
    if (!window.confirm(`Are you sure you want to delete table "${tableName}"?`)) return;

    try {
      const res = await fetch(`/api/tables/${encodeURIComponent(tableName)}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete table');
      }
      addToast(`Table "${tableName}" deleted successfully!`);
      setActiveTable(null);
      await fetchTables();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handle item insertion
  const handleAddItem = async (tableName, item) => {
    try {
      const res = await fetch(`/api/tables/${encodeURIComponent(tableName)}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add item');

      addToast('Item inserted successfully!');
      await fetchItems(tableName);
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (tableName, key) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/tables/${encodeURIComponent(tableName)}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete item');
      }
      addToast('Item deleted successfully!');
      await fetchItems(tableName);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handle sample data seeding
  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed sample data');

      addToast(data.message || 'Sample data seeded!');
      await fetchTables();
      setActiveTable({ TableName: 'Products' });
      await fetchItems('Products');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        health={health}
        onSeedData={handleSeedData}
        onRefresh={() => {
          checkHealth();
          fetchTables();
          if (activeTable?.TableName) fetchItems(activeTable.TableName);
        }}
        seeding={seeding}
      />

      <div className="main-content">
        <TableList
          tables={tables}
          activeTable={activeTable}
          onSelectTable={setActiveTable}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <ItemsView
          table={activeTable}
          items={items}
          loading={loadingItems}
          onRefreshItems={() => fetchItems(activeTable?.TableName)}
          onOpenAddItem={() => {
            if (activeTable) setIsAddItemModalOpen(true);
            else setIsCreateModalOpen(true);
          }}
          onDeleteItem={handleDeleteItem}
          onViewItem={setViewingItem}
          onDeleteTable={handleDeleteTable}
        />
      </div>

      <CreateTableModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTable={handleCreateTable}
      />

      <CreateItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        table={activeTable}
        onAddItem={handleAddItem}
      />

      <ViewItemModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
