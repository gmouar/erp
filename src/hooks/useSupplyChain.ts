import { useState, useCallback } from 'react';
import { supplyChainService } from '../services/supplyChainService';
import { PurchaseOrder, Vendor, Shipment, InventoryItem } from '../types/supplyChain';

export const useSupplyChain = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await supplyChainService.createPurchaseOrder(order);
      return result;
    } catch (err) {
      setError('Failed to create purchase order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await supplyChainService.updateInventoryQuantity(itemId, quantity);
      return result;
    } catch (err) {
      setError('Failed to update inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const trackShipment = async (shipmentId: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement shipment tracking
    } catch (err) {
      setError('Failed to track shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPurchaseOrder,
    updateInventory,
    trackShipment
  };
};
