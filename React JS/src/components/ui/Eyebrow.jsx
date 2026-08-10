export default function Eyebrow({ children, dark = false, className = '' }) {
  return (
    <div className={`eyebrow ${dark ? 'on-dark' : ''} ${className}`}>
      <span className="dot"></span>
      {children}
    </div>
  );
}
