import { useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  useLocation,
  Outlet,
} from 'react-router-dom';
import PageShell from './components/PageShell';
import { ToastProvider } from './contexts/ToastContext';
import { useTelemetry } from './hooks/useTelemetry';
import DatasetsPage from './pages/datasets/page';
import EvalCreatorPage from './pages/eval-creator/page';
import EvalPage from './pages/eval/page';
import EvalsIndexPage from './pages/evals/page';
import HistoryPage from './pages/history/page';
import LauncherPage from './pages/launcher/page';
import LoginPage from './pages/login';
import PromptsPage from './pages/prompts/page';
import ReportPage from './pages/redteam/report/page';
import RedteamSetupPage from './pages/redteam/setup/page';
import SettingsPage from './pages/settings/page';
import EvalReportPage from './pages/eval-report/page';
import Home from './Home/Home.';
import Dashboard from './pages/dashboard/main';

const basename = import.meta.env.VITE_PUBLIC_BASENAME || '';

function TelemetryTracker() {
  const location = useLocation();
  const { recordEvent } = useTelemetry();

  useEffect(() => {
    recordEvent('webui_page_view', { path: location.pathname });
  }, [location, recordEvent]);

  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {import.meta.env.VITE_PROMPTFOO_LAUNCHER && (
        <Route path="/launcher" element={<LauncherPage />} />
      )}
      <Route path="/" element={<PageShell />}>
       <Route element={<TelemetryTracker />}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route index element={<Home />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/eval" element={<EvalPage />} />
          <Route path="/evals" element={<EvalsIndexPage />} />
          <Route path="/eval/:evalId" element={<EvalPage />} />
          <Route path="/eval/:evalId/report" element={<EvalReportPage />} />
          <Route path="/progress" element={<Navigate to="/history" replace />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/prompts" element={<PromptsPage />} />
          <Route path="/redteam" element={<Navigate to="/redteam/setup" replace />} />
          <Route path="/redteam/setup" element={<RedteamSetupPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/setup" element={<EvalCreatorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          </Route>
      </Route>
    </>,
  ),
  { basename },
);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
