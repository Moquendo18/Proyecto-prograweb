import Sidebar from './Sidebar';

export default function MainLayout({ children, currentUser, currentPage, onNavigate, onSelectLive, onStartStream }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onSelectLive={onSelectLive}
        onStartStream={onStartStream}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
