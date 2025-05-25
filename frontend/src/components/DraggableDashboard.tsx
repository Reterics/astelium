import React, {useState, useRef, useEffect} from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {motion} from 'framer-motion';
import {BaseEventPayload, ElementDragType} from '@atlaskit/pragmatic-drag-and-drop/types';

interface DraggableDashboardProps {
  children: React.ReactNode[];
  onOrderChange?: (newOrder: number[]) => void;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  children,
  onOrderChange,
}) => {
  // Initialize widget order based on children array indices
  const [widgetOrder, setWidgetOrder] = useState<number[]>(
    Array.from({length: children.length}, (_, i) => i)
  );

  // Create a unique instance ID for this dashboard
  const instanceId = useRef(Symbol('dashboard-instance'));

  // Refs to track widget elements
  const widgetRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Refs to track drag handles
  const handleRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Track which widget is being dragged over
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Handle reordering widgets
  const reorderWidgets = (sourceIndex: number, destinationIndex: number) => {
    // No change in order
    if (sourceIndex === destinationIndex) {
      return;
    }

    // Reorder the widgets
    const newOrder = Array.from(widgetOrder);
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(destinationIndex, 0, removed);

    // Update state
    setWidgetOrder(newOrder);

    // Call callback if provided
    if (onOrderChange) {
      onOrderChange(newOrder);
    }
  };

  // Set up drop targets for each widget
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    // Common drop handler for all widgets
    const onDrop = ({source, location}: BaseEventPayload<ElementDragType>) => {
      if (!location.current.dropTargets.length) return;

      const sourceIndex = source.data.widgetIndex as number;
      const targetIndex = location.current.dropTargets[0].data.widgetIndex as number;

      // Remove any animation classes from all widgets
      document.querySelectorAll('[data-widget-id]').forEach((widget) => {
        widget.classList.remove('scale-105', 'opacity-50', 'shadow-lg', 'z-10');
      });

      // Reorder widgets
      reorderWidgets(sourceIndex, targetIndex);

      // Reset highlight
      setHighlightedIndex(null);
    };

    // Set up drop targets for each widget
    Object.entries(widgetRefs.current).forEach(([widgetId, element]) => {
      if (!element) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({
          widgetIndex: parseInt(widgetId.split('-')[1]),
        }),
        onDropTargetChange({location, source}) {
          // Reset all widget highlights
          document.querySelectorAll('[data-widget-id]').forEach((widget) => {
            if (widget !== source?.element) {
              widget.classList.remove('scale-105', 'shadow-md', 'border-blue-400');
            }
          });

          if (location.current.dropTargets.length > 0) {
            const targetWidgetId = location.current.dropTargets[0].data.widgetIndex;
            setHighlightedIndex(Number(targetWidgetId));

            // Add highlight effect to the target widget
            const targetElement = document.querySelector(
              `[data-widget-id="widget-${targetWidgetId}"]`
            );
            if (targetElement && targetElement !== source?.element) {
              targetElement.classList.add('scale-105', 'shadow-md', 'border-blue-400');
            }

            // Add effect to the dragged widget
            if (source?.element) {
              source.element.classList.add('opacity-80', 'shadow-lg', 'z-10', 'rotate-1');
            }
          } else {
            setHighlightedIndex(null);
          }
        },
        onDrop,
      });

      cleanupFns.push(cleanup);
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [widgetOrder]);

  // Set up draggable for each handle
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    Object.entries(handleRefs.current).forEach(([handleId, element]) => {
      if (!element) return;

      const widgetId = handleId.replace('handle-', 'widget-');
      const widgetIndex = parseInt(widgetId.split('-')[1]);

      const cleanup = draggable({
        element,
        getInitialData: () => ({
          instanceId: instanceId.current,
          widgetIndex: widgetIndex,
        }),
      });

      cleanupFns.push(cleanup);
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, [widgetOrder]);

  return (
    <div className='space-y-6'>
      {widgetOrder.map((index, position) => (
        <div
          key={`widget-${index}`}
          data-widget-id={`widget-${index}`}
          ref={(el) => {
            widgetRefs.current[`widget-${index}`] = el;
            return;
          }}
          className={`transition-shadow duration-200 ${
            highlightedIndex === index ? 'border-blue-400 shadow-md' : ''
          }`}
        >
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: position * 0.1}}
            className='relative'
          >
            {/* Drag handle */}
            <div
              ref={(el) => {
                handleRefs.current[`handle-${index}`] = el;
                return;
              }}
              className='absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 p-1 rounded-md cursor-move z-10 transition-colors duration-200'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='8' cy='6' r='2' />
                <circle cx='8' cy='12' r='2' />
                <circle cx='8' cy='18' r='2' />
                <circle cx='16' cy='6' r='2' />
                <circle cx='16' cy='12' r='2' />
                <circle cx='16' cy='18' r='2' />
              </svg>
            </div>

            {/* Widget content */}
            {children[index]}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default DraggableDashboard;
