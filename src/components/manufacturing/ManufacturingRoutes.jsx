import { Routes, Route } from 'react-router-dom';
import ProductionPlanning from './ProductionPlanning';
import InventoryManagement from './InventoryManagement';
import QualityControl from './QualityControl';
import MaintenanceManagement from './MaintenanceManagement';
import ManufacturingDashboard from './ManufacturingDashboard';
import WorkflowManagement from './WorkflowManagement';
import WorkOrder from './WorkOrder';
import ProductionSchedule from './ProductionSchedule';
import MaterialPlanning from './MaterialPlanning';

const ManufacturingRoutes = () => {
  return (
    <Routes>
      <Route index element={<ManufacturingDashboard />} />
      <Route path="production" element={<ProductionPlanning />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="quality" element={<QualityControl />} />
      <Route path="maintenance" element={<MaintenanceManagement />} />
      <Route path="workflow" element={<WorkflowManagement />} />
      <Route path="work-orders" element={<WorkOrder />} />
      <Route path="schedule" element={<ProductionSchedule />} />
      <Route path="materials" element={<MaterialPlanning />} />
    </Routes>
  );
};

export default ManufacturingRoutes;
