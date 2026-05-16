import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LivePage from './pages/LivePage';
import DashboardPage from './pages/DashboardPage';
import StartStreamModal from './components/live/StartStreamModal';

const DEMO_USER = {
  id: 1,
  username: 'demo_user',
  avatar_url: 'default-avatar.png',
  nivel: 5,
  balance_monedas: 500,
};

export default function App() {
  const [page, setPage] = useState('home');
  const [currentLiveId, setCurrentLiveId] = useState(null);
  const [showStartStream, setShowStartStream] = useState(false);

  return (
    <ThemeProvider>
      <SocketProvider usuarioId={DEMO_USER.id}>
        <MainLayout
          currentUser={DEMO_USER}
          currentPage={page}
          onNavigate={setPage}
          onSelectLive={(id) => {
            setCurrentLiveId(id);
            setPage('live');
          }}
          onStartStream={() => setShowStartStream(true)}
        >
          {page === 'home' && (
            <HomePage onSelectLive={(id) => {
              setCurrentLiveId(id);
              setPage('live');
            }} />
          )}
          {page === 'live' && currentLiveId && (
            <LivePage
              transmisionId={currentLiveId}
              usuario={DEMO_USER}
              onEndStream={() => {
                setCurrentLiveId(null);
                setPage('home');
              }}
            />
          )}
          {page === 'dashboard' && (
            <DashboardPage usuarioId={DEMO_USER.id} />
          )}
        </MainLayout>

        <StartStreamModal
          isOpen={showStartStream}
          onClose={() => setShowStartStream(false)}
          usuarioId={DEMO_USER.id}
          onLiveCreated={(id) => {
            setCurrentLiveId(id);
            setPage('live');
          }}
        />
      </SocketProvider>
    </ThemeProvider>
  );
}
