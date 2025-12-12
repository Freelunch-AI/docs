import { useState, useEffect, useRef } from 'react';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
}

export function ResizeHandle({ direction, onResize }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = direction === 'horizontal' 
        ? e.clientX - startPosRef.current 
        : e.clientY - startPosRef.current;
      
      startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    setIsDragging(true);
  };

  return (
    <div
      className={`${
        direction === 'horizontal'
          ? 'w-1 cursor-col-resize hover:bg-[#007acc] active:bg-[#007acc]'
          : 'h-1 cursor-row-resize hover:bg-[#007acc] active:bg-[#007acc]'
      } ${isDragging ? 'bg-[#007acc]' : 'bg-transparent'} transition-colors select-none`}
      onMouseDown={handleMouseDown}
    />
  );
}
