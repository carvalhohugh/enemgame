import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/student/Dashboard';
import Arena from './pages/arena/Arena';
import InstitutionalPanel from './pages/admin/InstitutionalPanel';
import Diagnostic from './pages/auth/Diagnostic';
import Indicacoes from './pages/student/Indicacoes';
import Loja from './pages/student/Loja';
import Trilhas from './pages/student/Trilhas';
import Ranking from './pages/student/Ranking';
import Login from './pages/auth/Login';
import LiveClasses from './pages/student/LiveClasses';
import Conquistas from './pages/student/Conquistas';
import ClanSelection from './pages/auth/ClanSelection';
import UserProfile from './pages/student/Profile';
import SchoolPanel from './pages/admin/SchoolPanel';
import StudyHub from './pages/student/StudyHub';
import NotesGallery from './pages/student/NotesGallery';
import RedacaoPro from './pages/student/RedacaoPro';
import Inventory from './pages/student/Inventory';
import AdaptiveCalendar from './pages/student/AdaptiveCalendar';
import TrainingZone from './pages/student/TrainingZone';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/clans" element={<ClanSelection />} />
          <Route path="/onboarding" element={<Diagnostic />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="perfil" element={<UserProfile />} />
            <Route path="calendario" element={<AdaptiveCalendar />} />
            <Route path="conquistas" element={<Conquistas />} />
            <Route path="arena" element={<Arena />} />
            <Route path="redacao" element={<RedacaoPro />} />
            <Route path="live" element={<LiveClasses />} />
            <Route path="admin" element={<InstitutionalPanel />} />
            <Route path="admin/escola" element={<SchoolPanel />} />
            <Route path="indicacoes" element={<Indicacoes />} />
            <Route path="loja" element={<Loja />} />
            <Route path="trilhas" element={<Trilhas />} />
            <Route path="estudos" element={<StudyHub />} />
            <Route path="anotacoes" element={<NotesGallery />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="treinamento" element={<TrainingZone />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
