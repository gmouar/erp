import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  Engineering as ManufacturingIcon,
  LocalShipping as SupplyChainIcon,
  Chat as CommunicationIcon,
  Settings as SettingsIcon,
  Business as SalesIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import React from 'react';

export const getRoleMenuItems = (role) => {
  const createIcon = (Icon) => React.createElement(Icon);

  const baseItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: createIcon(DashboardIcon)
    },
    {
      label: 'Communication',
      path: '/communication',
      icon: createIcon(CommunicationIcon)
    }
  ];

  const roleSpecificItems = {
    HR: [
      {
        label: 'Employees',
        path: '/hr/employees',
        icon: createIcon(PeopleIcon)
      },
      {
        label: 'Recruitment',
        path: '/hr/recruitment',
        icon: createIcon(PeopleIcon)
      },
      {
        label: 'Performance',
        path: '/hr/performance',
        icon: createIcon(AssessmentIcon)
      }
    ],
    Finance: [
      {
        label: 'Budget',
        path: '/finance/budget',
        icon: createIcon(FinanceIcon)
      },
      {
        label: 'Expenses',
        path: '/finance/expenses',
        icon: createIcon(FinanceIcon)
      }
    ],
    'Manufacturing Manager': [
      {
        label: 'Production',
        path: '/manufacturing/production',
        icon: createIcon(ManufacturingIcon)
      },
      {
        label: 'Quality Control',
        path: '/manufacturing/quality',
        icon: createIcon(ManufacturingIcon)
      }
    ],
    Sales: [
      {
        label: 'Sales Dashboard',
        path: '/sales',
        icon: createIcon(SalesIcon)
      },
      {
        label: 'Leads',
        path: '/sales/leads',
        icon: createIcon(SalesIcon)
      }
    ],
    'Supply Chain Manager': [
      {
        label: 'Inventory',
        path: '/supply-chain/inventory',
        icon: createIcon(InventoryIcon)
      },
      {
        label: 'Shipments',
        path: '/supply-chain/shipments',
        icon: createIcon(SupplyChainIcon)
      }
    ],
    Superuser: [
      {
        label: 'Settings',
        path: '/settings',
        icon: createIcon(SettingsIcon)
      }
    ]
  };

  return [...baseItems, ...(roleSpecificItems[role] || [])];
};
