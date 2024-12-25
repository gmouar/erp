import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Card, Typography, Chip } from '@mui/material';

const SalesPipeline = () => {
  const [stages, setStages] = useState({
    prospect: [],
    qualification: [],
    proposal: [],
    negotiation: [],
    'closed-won': [],
    'closed-lost': []
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    const newStages = { ...stages };
    const [movedItem] = newStages[sourceStage].splice(source.index, 1);
    newStages[destStage].splice(destination.index, 0, movedItem);

    setStages(newStages);
    // Update opportunity stage in backend
    updateOpportunityStage(movedItem.id, destStage);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, p: 2, overflowX: 'auto' }}>
        {Object.entries(stages).map(([stage, opportunities]) => (
          <Box key={stage} sx={{ minWidth: 280 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
              <Chip 
                label={opportunities.length}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Droppable droppableId={stage}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ minHeight: 500 }}
                >
                  {opportunities.map((opp, index) => (
                    <Draggable
                      key={opp.id}
                      draggableId={opp.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 2 }}
                        >
                          <Typography variant="subtitle1">{opp.title}</Typography>
                          <Typography color="textSecondary">
                            ${opp.value.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {opp.customer.name}
                          </Typography>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default SalesPipeline;
