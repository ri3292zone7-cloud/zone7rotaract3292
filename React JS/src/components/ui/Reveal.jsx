import { useEffect, useRef } from 'react';

export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', style, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            el.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = typeof delay === 'number' ? `${delay}s` : delay;
  return (
    <Tag ref={ref} data-reveal style={{ ...(d ? { '--d': d } : {}), ...style }} className={className} {...rest}>
      {children}
    </Tag>
  );
}
