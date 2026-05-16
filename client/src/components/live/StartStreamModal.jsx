import { useState } from 'react';
import { X, Video, Loader } from 'lucide-react';

const CATEGORIES = ['gaming', 'musica', 'charlas'];

export default function StartStreamModal({ isOpen, onClose, usuarioId, onLiveCreated }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('gaming');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/lives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, titulo: titulo.trim(), categoria }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear transmisión');
      onLiveCreated(data.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-md mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Iniciar Transmisión</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Qué estás transmitiendo?"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-red-500 placeholder-gray-500"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    categoria === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!titulo.trim() || creating}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {creating ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Video size={16} />
            )}
            {creating ? 'Iniciando...' : 'Ir en Vivo'}
          </button>
        </form>
      </div>
    </div>
  );
}
