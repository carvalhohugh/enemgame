import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Diagnostic from './pages/auth/Diagnostic';

// Pages
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = lazy(() => import('./pages/student/Dashboard'));
const Calendario = lazy(() => import('./pages/student/Calendario'));
const Arena = lazy(() => import('./pages/arena/Arena'));
const TrainingZone = lazy(() => import('./pages/student/TrainingZone'));
const RedacaoPro = lazy(() => import('./pages/student/RedacaoPro'));
const Ranking = lazy(() => import('./pages/student/Ranking'));
const Login = lazy(() => import('./pages/auth/Login'));
const Profile = lazy(() => import('./pages/student/Profile'));
const Inventory = lazy(() => import('./pages/student/Inventory'));
const Store = lazy(() => import('./pages/student/Loja'));
const LiveClasses = lazy(() => import('./pages/student/LiveClasses'));
const StudyHub = lazy(() => import('./pages/student/StudyHub'));
const NotesGallery = lazy(() => import('./pages/student/NotesGallery'));
const InstitutionalPanel = lazy(() => import('./pages/admin/InstitutionalPanel'));
const Relatorios = lazy(() => import('./pages/admin/Relatorios'));
const Financeiro = lazy(() => import('./pages/admin/Financeiro'));
const MeuCla = lazy(() => import('./pages/student/MeuCla'));
const MinhasNotas = lazy(() => import('./pages/student/MinhasNotas'));
const SisuSimulador = lazy(() => import('./pages/student/SisuSimulador'));
const Flashcards = lazy(() => import('./pages/student/Flashcards'));
const BattleMode = lazy(() => import('./pages/arena/BattleMode'));
const StudentDataVis = lazy(() => import('./pages/student/StudentDataVis'));
const Indicacoes = lazy(() => import('./pages/student/Indicacoes'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508', color: '#6366f1' }}>
              <div className="loader">Carregando Arena...</div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Diagnostic />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="calendario" element={<Calendario />} />
                <Route path="arena" element={<Arena />} />
                <Route path="treinamento" element={<TrainingZone />} />
                <Route path="redacao" element={<RedacaoPro />} />
                <Route path="ranking" element={<Ranking />} />
                <Route path="perfil" element={<Profile />} />
                <Route path="inventario" element={<Inventory />} />
                <Route path="loja" element={<Store />} />
                <Route path="live" element={<LiveClasses />} />
                <Route path="estudos" element={<StudyHub />} />
                <Route path="anotacoes" element={<NotesGallery />} />
                <Route path="admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_ESCOLA']}>
                    <InstitutionalPanel />
                  </ProtectedRoute>
                } />
                <Route path="admin/relatorios" element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_ESCOLA', 'VENDEDOR']}>
                    <Relatorios />
                  </ProtectedRoute>
                } />
                <Route path="admin/financeiro" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Financeiro />
                  </ProtectedRoute>
                } />
                <Route path="meu-cla" element={<MeuCla />} />
                <Route path="minhas-notas" element={<MinhasNotas />} />
                <Route path="simulador" element={<SisuSimulador />} />
                <Route path="flashcards" element={<Flashcards />} />
                <Route path="duelos" element={<BattleMode />} />
                <Route path="desempenho" element={<StudentDataVis />} />
                <Route path="indicacoes" element={<Indicacoes />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
