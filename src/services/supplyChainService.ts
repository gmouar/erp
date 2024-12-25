import { Vendor, PurchaseOrder, Shipment, InventoryItem } from '../types/supplyChain';

class SupplyChainService {
  private baseUrl = '/api/supply-chain';

  // Vendor Management
  async getVendors(): Promise<Vendor[]> {
    const response = await fetch(`${this.baseUrl}/vendors`);
    return response.json();
  }

  async createVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    const response = await fetch(`${this.baseUrl}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });
    return response.json();
  }

  // Purchase Order Management
  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    const response = await fetch(`${this.baseUrl}/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return response.json();
  }

  async updatePurchaseOrderStatus(
    orderId: string, 
    status: PurchaseOrder['status']
  ): Promise<void> {
    await fetch(`${this.baseUrl}/purchase-orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  // Inventory Management
  async getInventoryLevels(): Promise<InventoryItem[]> {
    const response = await fetch(`${this.baseUrl}/inventory`);
    return response.json();
  }

  async updateInventoryQuantity(
    itemId: string, 
    quantity: number
  ): Promise<InventoryItem> {
    const response = await fetch(`${this.baseUrl}/inventory/${itemId}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  }

  // Shipment Tracking
  async createShipment(shipment: Omit<Shipment, 'id'>): Promise<Shipment> {
    const response = await fetch(`${this.baseUrl}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment)
    });
    return response.json();
  }

  async updateShipmentStatus(
    shipmentId: string, 
    status: Shipment['status']
  ): Promise<void> {
    await fetch(`${this.baseUrl}/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }
}

export const supplyChainService = new SupplyChainService();
