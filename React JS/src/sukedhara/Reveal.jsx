import { useEffect, useRef } from 'react';

/*
 * Scroll-reveal wrapper: fades + slides + unblurs children the first time
 * they enter the viewport. Zero JS animation cost after reveal.
 */
export default function Reveal({ children, delay = 0, y = 28, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('suk-revealed');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('suk-revealed');
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`suk-reveal ${className}`}
      style={{ '--suk-delay': `${delay}ms`, '--suk-y': `${y}px` }}
    >
      {children}
    </Tag>
  );
}
