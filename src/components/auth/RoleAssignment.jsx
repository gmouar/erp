import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../context/AuthContext';
import { createAuditLog } from '../../services/auditService';
import { sendNotification } from '../../services/notificationService';

const RoleAssignment = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, newRole: '' });
  const { user: currentUser, updateUserRole } = useAuth();

  const roles = [
    'Unassigned',
    'HR',
    'Finance',
    'Manager',
    'Employee',
    'Field Worker',
    'Work from Home'
  ];

  const availableRoles = [
    'User', 'HR', 'Finance', 'Manufacturing Manager',
    'Sales', 'Supply Chain Manager', 'Superuser'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setConfirmDialog({ open: true, user: userId, newRole });
  };

  const confirmRoleChange = async () => {
    const { user, newRole } = confirmDialog;
    try {
      // Update role in database
      await fetch(`/api/users/${user}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      // Create audit log
      await createAuditLog({
        action: 'ROLE_CHANGE',
        userId: user,
        details: `Role changed to ${newRole}`
      });

      // Send notification
      await sendNotification({
        userId: user,
        type: 'ROLE_CHANGE',
        message: `Your role has been updated to ${newRole}`
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
    setConfirmDialog({ open: false, user: null, newRole: '' });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleUpdateUser = async () => {
    try {
      // This would be replaced with actual API call
      await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedUser)
      });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      setSuccess('User information updated successfully');
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update user information');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Role Assignment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Current Role</TableCell>
                <TableCell>New Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Select
                      value=""
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                      disabled={user.id === currentUser.id}
                    >
                      {availableRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit User">
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Activity Log">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User Information</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                value={selectedUser.firstName}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  firstName: e.target.value
                })}
              />
              <TextField
                label="Last Name"
                value={selectedUser.lastName}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  lastName: e.target.value
                })}
              />
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, user: null, newRole: '' })}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          Are you sure you want to change this user's role?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, user: null, newRole: '' })}>Cancel</Button>
          <Button onClick={confirmRoleChange} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleAssignment;
