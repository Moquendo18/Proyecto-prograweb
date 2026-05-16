import { useState, useEffect } from 'react';
import { X, Coins } from 'lucide-react';
import { useGiftEvents } from '../../hooks/useSocket';

export default function GiftModal({ isOpen, onClose, transmisionId, userBalance }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sendGift } = useGiftEvents(transmisionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    fetch('/api/gifts')
      .then((r) => r.json())
      .then((data) => {
        setGifts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  const handleSendGift = (gift) => {
    if (userBalance < gift.costo_monedas) {
      setError(`No tienes suficientes monedas. Necesitas ${gift.costo_monedas} monedas para enviar ${gift.nombre}.`);
      return;
    }
    setError(null);
    sendGift(gift.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Enviar Regalo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50">
          <Coins size={16} className="text-yellow-400" />
          <span className="text-sm text-gray-300">Tu saldo:</span>
          <span className="text-sm font-bold text-yellow-400">{userBalance} monedas</span>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gifts.map((gift) => {
                const canAfford = userBalance >= gift.costo_monedas;
                return (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    disabled={!canAfford}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      canAfford
                        ? 'border-gray-700 hover:border-red-500 bg-gray-800 hover:bg-gray-750 cursor-pointer'
                        : 'border-gray-800 bg-gray-800/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl">{gift.icono_url}</span>
                    <span className="text-sm text-white font-medium">{gift.nombre}</span>
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <Coins size={12} />
                      {gift.costo_monedas}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
