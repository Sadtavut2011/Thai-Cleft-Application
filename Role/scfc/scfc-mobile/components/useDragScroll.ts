import { useRef, useCallback } from 'react';

/**
 * Hook: drag-to-scroll สำหรับ horizontal scrollable containers
 * ใช้ delayed pointer capture + hasMoved guard เพื่อแยก click vs drag
 */
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const hasMoved = useRef(false);
  const pointerId = useRef<number | null>(null);
  const captured = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    isDragging.current = true;
    hasMoved.current = false;
    captured.current = false;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    pointerId.current = e.pointerId;
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !ref.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 3) {
      hasMoved.current = true;
      if (!captured.current && pointerId.current !== null) {
        try { ref.current.setPointerCapture(pointerId.current); } catch {}
        captured.current = true;
      }
    }
    ref.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onPointerUp = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (!ref.current) return;
    if (captured.current && pointerId.current !== null) {
      try { ref.current.releasePointerCapture(pointerId.current); } catch {}
    }
    captured.current = false;
    pointerId.current = null;
    ref.current.style.cursor = 'grab';
    ref.current.style.scrollSnapType = 'x mandatory';
  }, []);

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
    },
    hasMoved,
  };
}
