import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pageCss from './meetings.css?inline';

export default function MeetingsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Redirecting, Zone 7 Rotaract';
    const el = document.createElement('style');
    el.setAttribute('data-page-css', 'true');
    el.textContent = pageCss;
    document.head.appendChild(el);
    const t = setTimeout(() => navigate('/tutorials', { replace: true }), 1500);
    return () => {
      el.remove();
      clearTimeout(t);
    };
  }, [navigate]);

  return (
    <div>
      <p>Meeting guides have moved to the Tutorials section.</p>
      <p><Link to="/tutorials">Continue to Tutorials →</Link></p>
      <p><small>You will be redirected automatically.</small></p>
    </div>
  );
}
