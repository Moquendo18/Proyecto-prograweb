import { useState, useEffect } from 'react';
import { Home, TrendingUp, Gamepad2, Music, MessageCircle, Sun, Moon, LogIn, Video, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIES = [
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'musica', label: 'Música', icon: Music },
  { id: 'charlas', label: 'Charlas', icon: MessageCircle },
];

export default function Sidebar({ currentUser, currentPage, onNavigate, onSelectLive, onStartStream }) {
  const { dark, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState(null);
  const [liveChannels, setLiveChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lives')
      .then((r) => r.json())
      .then((data) => {
        setLiveChannels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? liveChannels.filter((c) => c.categoria === activeCategory)
    : liveChannels;

  return (
    <aside className="w-64 h-screen bg-gray-900 dark:bg-gray-900 bg-gray-50 border-r border-gray-800 dark:border-gray-800 border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <h1 className="text-xl font-bold text-red-500 tracking-tight">TikTok ULima</h1>
      </div>

      <nav className="p-3 space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentPage === 'home'
              ? 'bg-red-500/10 text-red-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Home size={18} />
          Inicio
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentPage === 'dashboard'
              ? 'bg-red-500/10 text-red-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <TrendingUp size={18} />
          Estadísticas
        </button>

        <button
          onClick={onStartStream}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          <Video size={18} />
          Ir en Vivo
        </button>
      </nav>

      <div className="px-3 mt-2">
        <h3 className="text-xs font-semibold uppercase text-gray-500 px-3 mb-2">Categorías</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-red-500/10 text-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 mt-4">
        <h3 className="text-xs font-semibold uppercase text-gray-500 px-3 mb-2">
          En Vivo
        </h3>
        {loading ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600 text-xs px-3">Sin transmisiones activas</p>
        ) : (
          <div className="space-y-1">
            {filtered.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectLive(channel.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <div className="text-left truncate">
                  <p className="text-white truncate">{channel.titulo}</p>
                  <p className="text-xs text-gray-500">{channel.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 dark:border-gray-800 border-gray-200 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? 'Modo Claro' : 'Modo Oscuro'}
        </button>

        {currentUser ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">
              {currentUser.username[0].toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="text-white font-medium truncate">{currentUser.username}</p>
              <p className="text-xs text-gray-500">Nv.{currentUser.nivel}</p>
            </div>
          </div>
        ) : (
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <LogIn size={18} />
            Iniciar Sesión
          </button>
        )}
      </div>
    </aside>
  );
}
