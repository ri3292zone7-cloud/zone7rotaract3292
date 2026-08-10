export default function SiteFooter() {
  return (
    <footer>
      © 2026 Zone 7, Rotaract District 3292 Nepal-Bhutan. The Zonal Magazine is published by the Zone 7 team.{' '}
      &nbsp;·&nbsp;{' '}
      <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        Back to top
      </a>
    </footer>
  );
}
