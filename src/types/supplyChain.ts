export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'blacklisted';
  rating: number;
  paymentTerms: string;
  categories: string[];
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'received' | 'rejected';
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  origin: string;
  destination: string;
  cost: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
  lastUpdated: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  sections: WarehouseSection[];
}

export interface WarehouseSection {
  id: string;
  name: string;
  type: 'raw' | 'finished' | 'packaging';
  capacity: number;
  temperature?: number;
  humidity?: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reference: string;
  date: Date;
  performedBy: string;
}

export interface StockAlert {
  id: string;
  itemId: string;
  type: 'low_stock' | 'expiring' | 'expired';
  threshold?: number;
  currentLevel?: number;
  expiryDate?: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
}
