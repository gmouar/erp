import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip
} from '@mui/material';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);

  const getMovementColor = (type) => {
    switch (type) {
      case 'in': return 'success';
      case 'out': return 'error';
      case 'transfer': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stock Movements
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Performed By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                <TableCell>{movement.itemId}</TableCell>
                <TableCell>
                  <Chip 
                    label={movement.type}
                    color={getMovementColor(movement.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.fromLocation || '-'}</TableCell>
                <TableCell>{movement.toLocation || '-'}</TableCell>
                <TableCell>{movement.reference}</TableCell>
                <TableCell>{movement.performedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockMovements;
