import {
  Work as WorkIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

export const getRoleMenuItems = (role) => {
  const baseItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <AssessmentIcon />
    },
    {
      label: 'Communication',
      path: '/communication',
      icon: <ChatIcon />
    }
  ];

  const roleSpecificItems = {
    HR: [
      {
        label: 'Job Postings',
        path: '/hr/jobs',
        icon: <WorkIcon />
      },
      // ...existing code...
    ],
    // ...existing code...
  };

  return [...baseItems, ...(roleSpecificItems[role] || [])];
};

export const getRolePermissions = (role) => {
  const permissions = {
    HR: {
      canManageUsers: true,
      canManageJobs: true,
      requires2FA: true
    },
    // ...existing code...
  };

  return permissions[role] || { canManageUsers: false, canManageJobs: false };
};
