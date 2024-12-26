import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ModuleCard = ({ title, items }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <List>
          {items.map((item, index) => (
            <ListItem
              key={index}
              button
              component={Link}
              to={item.link}
              sx={{ borderRadius: 1 }}
            >
              <ListItemText primary={item.label} />
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <ArrowForwardIcon fontSize="small" />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
