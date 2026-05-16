import { useState, useEffect } from 'react';
import { Eye, MessageCircle, Gift, Clock, Play, Radio } from 'lucide-react';

export default function HomePage({ onSelectLive }) {
  const [pastStreams, setPastStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lives/past')
      .then((r) => r.json())
      .then((data) => { setPastStreams(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Radio size={24} className="text-red-500" />
          <h1 className="text-2xl font-bold text-white">Últimos Streamings</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : pastStreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Clock size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No hay streams anteriores</p>
            <p className="text-sm mt-1">Los streams finalizados aparecerán aquí</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors group cursor-pointer"
                onClick={() => onSelectLive(stream.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-red-500/80 transition-colors">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-xs text-gray-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(stream.creado_en).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{stream.titulo}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{stream.username} · {stream.categoria}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {stream.total_espectadores}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} /> {stream.total_mensajes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift size={12} /> {stream.total_regalos}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
