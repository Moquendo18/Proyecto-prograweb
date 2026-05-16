import { Gift, Wallet, Users } from 'lucide-react';

export default function LiveStream({ stream, currentAlert }) {
  return (
    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center group">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />

      <div className="relative text-center z-10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
          <span className="text-4xl">📺</span>
        </div>
        <h2 className="text-white text-xl font-bold">{stream?.titulo || 'Transmisión en Vivo'}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {stream?.username || 'Streamer'} · {stream?.categoria || 'General'}
        </p>
      </div>

      {currentAlert && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <div className="animate-gift-alert bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl px-8 py-6 shadow-2xl text-center">
            <div className="text-6xl mb-3">{currentAlert.regalo.icono_url}</div>
            <p className="text-white text-lg font-bold drop-shadow-lg">
              ¡Regalo de {currentAlert.regalo.nombre}!
            </p>
            <p className="text-white/80 text-sm">
              {currentAlert.regalo.costo_monedas} monedas
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          EN VIVO
        </span>
        <span className="flex items-center gap-1 bg-black/60 text-gray-300 text-xs px-2.5 py-1 rounded-full">
          <Users size={12} />
          {stream?.total_espectadores || 0}
        </span>
      </div>
    </div>
  );
}
