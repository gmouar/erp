export interface WorkOrder {
  id: string;
  productId: string;
  quantity: number;
  startDate: Date;
  dueDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  materials: MaterialRequirement[];
  qualityChecks: QualityCheck[];
  progress: number;
}

export interface MaterialRequirement {
  materialId: string;
  requiredQuantity: number;
  allocatedQuantity: number;
  status: 'pending' | 'allocated' | 'consumed';
}

export interface QualityCheck {
  id: string;
  parameter: string;
  expectedValue: string;
  actualValue?: string;
  status: 'pending' | 'passed' | 'failed';
  checkedBy?: string;
  checkedAt?: Date;
  notes?: string;
}

export interface ProductionSchedule {
  workOrderId: string;
  startTime: Date;
  endTime: Date;
  workstation: string;
  operators: string[];
  status: 'scheduled' | 'in-progress' | 'completed';
}
