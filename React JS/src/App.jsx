import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollProgress from './components/layout/ScrollProgress';
import HomePage from './pages/HomePage';
import CartDrawer from './components/magazine/CartDrawer';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const NeAboutPage = lazy(() => import('./pages/NeAboutPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const DistrictOverviewPage = lazy(() => import('./pages/DistrictOverviewPage'));
const ClubPage = lazy(() => import('./pages/ClubPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const ClubGuidesPage = lazy(() => import('./pages/ClubGuidesPage'));
const ClubToolsPage = lazy(() => import('./pages/ClubToolsPage'));
const HandbookPage = lazy(() => import('./pages/HandbookPage'));
const HandbookDetailPage = lazy(() => import('./pages/HandbookDetailPage'));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'));
const TutorialDetailPage = lazy(() => import('./pages/TutorialDetailPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const MerchPage = lazy(() => import('./pages/MerchPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const MeetingsPage = lazy(() => import('./pages/MeetingsPage'));
const SelftestPage = lazy(() => import('./pages/SelftestPage'));
const PendingApplicationsPage = lazy(() => import('./pages/PendingApplicationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink)', fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
      <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', border: '3px solid rgba(225,26,110,.25)', borderTopColor: '#E11A6E', animation: 'spin 0.8s linear infinite' }} />
      Loading…
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (window.__retryHash < 3) {
          window.__retryHash = (window.__retryHash || 0) + 1;
          setTimeout(tryScroll, 120);
        }
      };
      setTimeout(tryScroll, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
        <Route path="/ne-about" element={<Suspense fallback={<PageLoader />}><NeAboutPage /></Suspense>} />
        <Route path="/join" element={<Suspense fallback={<PageLoader />}><JoinPage /></Suspense>} />
        <Route path="/gallery" element={<Suspense fallback={<PageLoader />}><GalleryPage /></Suspense>} />
        <Route path="/district-overview" element={<Suspense fallback={<PageLoader />}><DistrictOverviewPage /></Suspense>} />
        <Route path="/club/:slug" element={<Suspense fallback={<PageLoader />}><ClubPage /></Suspense>} />
        <Route path="/project" element={<Suspense fallback={<PageLoader />}><ProjectPage /></Suspense>} />
        <Route path="/guides" element={<Suspense fallback={<PageLoader />}><GuidesPage /></Suspense>} />
        <Route path="/club-guides" element={<Suspense fallback={<PageLoader />}><ClubGuidesPage /></Suspense>} />
        <Route path="/club-tools" element={<Suspense fallback={<PageLoader />}><ClubToolsPage /></Suspense>} />
        <Route path="/handbook" element={<Suspense fallback={<PageLoader />}><HandbookPage /></Suspense>} />
        <Route path="/handbook/:slug" element={<Suspense fallback={<PageLoader />}><HandbookDetailPage /></Suspense>} />
        <Route path="/tutorials" element={<Suspense fallback={<PageLoader />}><TutorialsPage /></Suspense>} />
        <Route path="/tutorial/:slug" element={<Suspense fallback={<PageLoader />}><TutorialDetailPage /></Suspense>} />
        <Route path="/quiz" element={<Suspense fallback={<PageLoader />}><QuizPage /></Suspense>} />
        <Route path="/merch" element={<Suspense fallback={<PageLoader />}><MerchPage /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminPage /></Suspense>} />
        <Route path="/meetings" element={<Suspense fallback={<PageLoader />}><MeetingsPage /></Suspense>} />
        <Route path="/selftest" element={<Suspense fallback={<PageLoader />}><SelftestPage /></Suspense>} />
        <Route path="/pending-applications" element={<Suspense fallback={<PageLoader />}><PendingApplicationsPage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
      </Routes>
      <CartDrawer />
    </>
  );
}
