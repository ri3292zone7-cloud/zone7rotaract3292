import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function StoreDialog({ children, label, onClose, className = '' }) {
  const dialog = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog ref={dialog} className={`st-dialog ${className}`} aria-label={label}
      onCancel={(event) => { event.preventDefault(); close.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close.current(); }}>
      {children}
    </dialog>,
    document.body
  );
}
