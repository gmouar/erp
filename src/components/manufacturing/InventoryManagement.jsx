import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkPermission } from '../../utils/roleUtils';
import './Manufacturing.css';

const InventoryManagement = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all'
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    minQuantity: '',
    maxQuantity: '',
    expiryDateBefore: '',
    supplier: 'all'
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/manufacturing/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleReorder = async (itemId) => {
    try {
      await fetch(`/api/manufacturing/inventory/${itemId}/reorder`, {
        method: 'POST'
      });
      fetchInventory(); // Refresh inventory after reorder
    } catch (error) {
      console.error('Error reordering item:', error);
    }
  };

  const handleInventoryUpdate = async (itemId, updates) => {
    if (!checkPermission(user.role, 'inventory.edit')) {
      alert('Insufficient permissions');
      return;
    }

    try {
      await fetch(`/api/manufacturing/inventory/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const applyAdvancedFilters = (items) => {
    return items.filter(item => {
      const matchesQuantity = (!advancedFilters.minQuantity || item.quantity >= Number(advancedFilters.minQuantity)) &&
                             (!advancedFilters.maxQuantity || item.quantity <= Number(advancedFilters.maxQuantity));
      const matchesExpiry = !advancedFilters.expiryDateBefore || 
                           new Date(item.expiryDate) <= new Date(advancedFilters.expiryDateBefore);
      const matchesSupplier = advancedFilters.supplier === 'all' || 
                             item.supplier === advancedFilters.supplier;
      return matchesQuantity && matchesExpiry && matchesSupplier;
    });
  };

  const filteredInventory = applyAdvancedFilters(inventory.filter(item => {
    return (
      (filters.search === '' || 
        item.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === 'all' || item.category === filters.category) &&
      (filters.status === 'all' || item.status === filters.status)
    );
  }));

  return (
    <div className="inventory-management">
      <h2>Inventory Management</h2>

      <div className="inventory-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search inventory..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="raw">Raw Materials</option>
            <option value="wip">Work in Progress</option>
            <option value="finished">Finished Goods</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="advanced-filters">
        <input
          type="number"
          placeholder="Min Quantity"
          value={advancedFilters.minQuantity}
          onChange={(e) => setAdvancedFilters({...advancedFilters, minQuantity: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max Quantity"
          value={advancedFilters.maxQuantity}
          onChange={(e) => setAdvancedFilters({...advancedFilters, maxQuantity: e.target.value})}
        />
        <input
          type="date"
          value={advancedFilters.expiryDateBefore}
          onChange={(e) => setAdvancedFilters({...advancedFilters, expiryDateBefore: e.target.value})}
        />
      </div>

      <div className="inventory-grid">
        {filteredInventory.map(item => (
          <div key={item.id} className={`inventory-card status-${item.status}`}>
            <h4>{item.name}</h4>
            <div className="inventory-details">
              <span>Quantity: {item.quantity}</span>
              <span>Category: {item.category}</span>
              <span className="status-badge">{item.status}</span>
            </div>
            <div className="reorder-section">
              <span>Reorder Point: {item.reorderPoint}</span>
              {item.quantity <= item.reorderPoint && (
                <button
                  onClick={() => handleReorder(item.id)}
                  className="reorder-button"
                >
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
