import React from 'react';
import { useOrders } from '../../hooks/useOrders';

const OrderManagement = () => {
  const { orders, loading, updateOrderStatus, updatePaymentStatus } = useOrders();

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="order-management">
      <h2>Sales Orders</h2>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Quote #</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.quoteId}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </td>
                <td>
                  {order.deliveryDate 
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : 'Not scheduled'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => {}}>View Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
