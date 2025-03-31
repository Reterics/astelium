import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  RefObject,
} from 'react';

export interface DraggableDivProps {
  ref: RefObject<HTMLDivElement | null>;
  handle: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent) => void;
}

const DraggableDiv = (
{
  ref,
  handle,
  onClick,
  className,
  children,
}: Readonly<DraggableDivProps>) => {
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({x: 0, y: 0});
  const pos = useRef<{x: number; y: number}>({
    x: window.innerWidth / 2 - 140,
    y: window.innerHeight / 4,
  });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;

      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        offsetRef.current.x = e.pageX - pos.current.x;
        offsetRef.current.y = e.pageY - pos.current.y;
      }

      setDragging(true);

      if (onClick) {
        onClick(e);
      }
      // Prevent text selection or default actions
      e.preventDefault();
    },
    [onClick, pos, ref]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const newX = e.pageX - offsetRef.current.x;
      const newY = e.pageY - offsetRef.current.y;

      if (ref.current) {
        ref.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);

        const transform = ref.current?.style.transform;
        const match = transform?.match(
          /translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/
        );
        if (match) {
          pos.current.x = parseFloat(match[1]);
          pos.current.y = parseFloat(match[2]);
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, pos, ref]);

  useEffect(() => {
    if (handle && ref.current) {
      const node = ref.current.querySelector(handle);
      if (node) {
        node.addEventListener('mousedown', handleMouseDown as EventListener);

        return () => {
          node.removeEventListener(
            'mousedown',
            handleMouseDown as EventListener
          );
        };
      }
    }
  }, [handle, handleMouseDown, ref]);

  useEffect(() => {
    if (ref.current && pos.current) {
      pos.current.x = window.innerWidth / 2 - ref.current.offsetWidth / 2;
      pos.current.y = window.innerHeight / 2 - ref.current.offsetHeight / 2;

      console.log(pos.current, window.innerHeight, window.innerWidth)
      ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
    }
  }, [ref]);

  return (
    <div
      className={'fixed z-50 select-none ' + (className ?? '')}
      ref={ref}
      style={{
        /*transform: `translate(${pos.current.x}px, ${pos.current.y}px)`,*/
        cursor: dragging ? 'grabbing' : undefined,
      }}
    >
      {children}
    </div>
  );
};
export default DraggableDiv
