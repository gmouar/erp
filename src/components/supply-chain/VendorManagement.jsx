import React, { useState, useEffect } from 'react';
import { supplyChainService } from '../../services/supplyChainService';
import { useAuth } from '../../context/AuthContext'; // Updated import path

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [newVendor, setNewVendor] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categories: []
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await supplyChainService.getVendors();
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vendor = await supplyChainService.createVendor({
        ...newVendor,
        status: 'active',
        rating: 0
      });
      setVendors([...vendors, vendor]);
      setNewVendor({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        categories: []
      });
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  return (
    <div className="vendor-management">
      <h2>Vendor Management</h2>

      <form onSubmit={handleSubmit} className="vendor-form">
        <div className="form-group">
          <label>Vendor Name</label>
          <input
            type="text"
            value={newVendor.name}
            onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Person</label>
          <input
            type="text"
            value={newVendor.contactPerson}
            onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add Vendor</button>
      </form>

      {loading ? (
        <div>Loading vendors...</div>
      ) : (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.contactPerson}</td>
                <td>
                  <span className={`status-badge ${vendor.status}`}>
                    {vendor.status}
                  </span>
                </td>
                <td>{vendor.rating}/5</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(vendor.id)}>Edit</button>
                    <button onClick={() => handleDelete(vendor.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorManagement;
