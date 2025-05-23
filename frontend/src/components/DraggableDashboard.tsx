import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

interface DraggableDashboardProps {
  children: React.ReactNode[];
  onOrderChange?: (newOrder: number[]) => void;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  children,
  onOrderChange
}) => {
  // Initialize widget order based on children array indices
  const [widgetOrder, setWidgetOrder] = useState<number[]>(
    Array.from({ length: children.length }, (_, i) => i)
  );

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    // Drop outside the list or no movement
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    // Reorder the widgets
    const newOrder = Array.from(widgetOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    // Update state
    setWidgetOrder(newOrder);

    // Call callback if provided
    if (onOrderChange) {
      onOrderChange(newOrder);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard-widgets">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-6"
          >
            {widgetOrder.map((index, position) => (
              <Draggable key={`widget-${index}`} draggableId={`widget-${index}`} index={position}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow duration-200 ${
                      snapshot.isDragging ? 'z-10 shadow-xl' : ''
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: position * 0.1 }}
                      className="relative"
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 p-1 rounded-md cursor-move z-10 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="6" r="2" />
                          <circle cx="8" cy="12" r="2" />
                          <circle cx="8" cy="18" r="2" />
                          <circle cx="16" cy="6" r="2" />
                          <circle cx="16" cy="12" r="2" />
                          <circle cx="16" cy="18" r="2" />
                        </svg>
                      </div>

                      {/* Widget content */}
                      {children[index]}
                    </motion.div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableDashboard;
