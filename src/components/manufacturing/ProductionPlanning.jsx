import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkPermission } from '../../utils/roleUtils';
import './Manufacturing.css';

const ProductionPlanning = () => {
  const { user } = useAuth();
  const [productionOrders, setProductionOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    productName: '',
    quantity: 0,
    startDate: '',
    endDate: '',
    priority: 'normal',
    status: 'planned'
  });

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!checkPermission(user.role, 'production.create')) {
      alert('Insufficient permissions');
      return;
    }

    try {
      const response = await fetch('/api/manufacturing/production-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await response.json();
      setProductionOrders([...productionOrders, data]);
    } catch (error) {
      console.error('Error creating production order:', error);
    }
  };

  return (
    <div className="production-planning">
      <h2>Production Planning</h2>
      
      <form onSubmit={handleCreateOrder} className="order-form">
        <input
          type="text"
          placeholder="Product Name"
          value={newOrder.productName}
          onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
        />
        {/* Add other form fields */}
      </form>

      <div className="production-orders">
        {productionOrders.map(order => (
          <div key={order.id} className="order-card">
            <h4>{order.productName}</h4>
            <div className="order-details">
              <span>Quantity: {order.quantity}</span>
              <span>Status: {order.status}</span>
              <span>Priority: {order.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionPlanning;
