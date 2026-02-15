import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProfileProvider, useAuthProfile } from '@/context/AuthProfileContext';
import { StudyProgressProvider } from '@/context/StudyProgressContext';
import AppErrorBoundary from '@/components/custom/AppErrorBoundary';
import StudyProgressSync from '@/features/dashboard/components/StudyProgressSync';
import RootLayout from '@/components/layout/RootLayout';

// Pages
import DashboardPage from '@/features/dashboard/DashboardPage';
import TrilhasPage from '@/features/trilhas/TrilhasPage';
import SimuladoSection from '@/features/exam/components/SimuladoSection';
import SimuladoRealPage from '@/features/exam/components/SimuladoRealPage';
import TesteRapidoPage from '@/features/exam/components/TesteRapidoPage';
import AdminPanel from '@/features/admin/components/AdminPanel';
import PublicEnrollmentPage from '@/pages/PublicEnrollmentPage';

import ClanSortingPage from '@/features/clans/ClanSortingPage';
import RedacaoPage from '@/features/redacao/RedacaoPage';
import ArenaPage from '@/features/arena/ArenaPage';
import BatalhaX1Page from '@/features/arena/BatalhaX1Page';
import BatalhaClaPage from '@/features/arena/BatalhaClaPage';
import ClanHubPage from '@/features/clans/ClanHubPage';
import ActivitiesPage from '@/features/activities/ActivitiesPage';
import AulasOnlinePage from '@/features/classes/AulasOnlinePage';
import ProfilePage from '@/features/profile/ProfilePage';

// Pages imports...
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';

/* ── Gate: força auth ── */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { profile, isLoading } = useAuthProfile();

  if (isLoading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Carregando...</div>;

  if (!profile.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/* ── Gate: força sorting de clã pós-cadastro ── */
function RequireClan({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthProfile();
  const location = useLocation();

  if (!profile.clanId && location.pathname !== '/app/clans/sorting') {
    return <Navigate to="/app/clans/sorting" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProfileProvider>
        <StudyProgressProvider>
          <AppErrorBoundary>
            <StudyProgressSync />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/matricula" element={<PublicEnrollmentPage />} />

              {/* Protected App Routes */}
              <Route path="/app" element={
                <RequireAuth>
                  <RequireClan>
                    <RootLayout />
                  </RequireClan>
                </RequireAuth>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="clans/sorting" element={<ClanSortingPage />} />
                <Route path="trilhas" element={<TrilhasPage />} />
                <Route path="simulado" element={<SimuladoSection />} />
                <Route path="simulado-real" element={<SimuladoRealPage />} />
                <Route path="teste-rapido" element={<TesteRapidoPage />} />
                <Route path="redacao" element={<RedacaoPage />} />
                <Route path="arena" element={<ArenaPage />} />
                <Route path="arena/x1" element={<BatalhaX1Page />} />
                <Route path="arena/cla" element={<BatalhaClaPage />} />
                <Route path="cla" element={<ClanHubPage />} />
                <Route path="atividades" element={<ActivitiesPage />} />
                <Route path="aulas" element={<AulasOnlinePage />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="perfil" element={<ProfilePage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppErrorBoundary>
        </StudyProgressProvider>
      </AuthProfileProvider>
    </BrowserRouter>
  );
}

export default App;
