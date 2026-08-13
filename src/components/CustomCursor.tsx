import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch devices aur chhoti screens par skip karein
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    
    // Initial position screen ke bahar (-100px) set karein taaki top-left glitch na ho
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let hasMoved = false; // Track karne ke liye ki mouse move hua ya nahi

    // Start with complete hidden state
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    
    // Initial transform set kar dein taaki ye default 0,0 par na ruke
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    function onMove(e: MouseEvent) {
      // Pehli baar mouse move hone par opacity 1 karein aur cursor ko show karein
      if (!hasMoved) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        hasMoved = true;
        
        // Ring ko instantly cursor ke paas snap karein taaki bahar se udta hua na aaye
        rx = e.clientX;
        ry = e.clientY;
      }

      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        'a, button, [data-cursor="hover"], input, textarea, [role="button"]'
      );
      ring.classList.toggle('is-hover', interactive);

      const dark = !!t?.closest('[data-cursor-dark="true"]');
      ring.classList.toggle('is-dark', dark);
    }

    function onLeave() {
      hasMoved = false; // Reset 
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    }
    
    function onEnter() {
      // Sirf opacity set mat karein unless mouse actual me move ho
      // Visibility control ab onMove me handle ho raha hai
    }

    function loop() {
      // Animation tabhi chale jab mouse screen par ho
      if (hasMoved) {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <>
      <div 
        ref={ringRef} 
        className="cursor-ring" 
        style={{ transition: 'opacity 0.3s ease' }} 
      />
      <div 
        ref={dotRef} 
        className="cursor-dot" 
        style={{ transition: 'opacity 0.3s ease' }} 
      />
    </>
  );
}