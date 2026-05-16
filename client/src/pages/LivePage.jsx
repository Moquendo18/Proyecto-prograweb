import { useState, useEffect } from 'react';
import { Gift, Wallet, Square, Loader } from 'lucide-react';
import LiveStream from '../components/live/LiveStream';
import ChatPanel from '../components/live/ChatPanel';
import GiftModal from '../components/live/GiftModal';
import PaymentModal from '../components/live/PaymentModal';
import { useGiftEvents } from '../hooks/useSocket';

export default function LivePage({ transmisionId, usuario, onEndStream }) {
  const [stream, setStream] = useState(null);
  const [showGifts, setShowGifts] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [balance, setBalance] = useState(usuario?.balance_monedas || 0);
  const [ending, setEnding] = useState(false);
  const { currentAlert } = useGiftEvents(transmisionId);

  useEffect(() => {
    if (!transmisionId) return;
    fetch(`/api/lives/${transmisionId}`)
      .then((r) => r.json())
      .then(setStream)
      .catch(() => {});
  }, [transmisionId]);

  const handleEndStream = async () => {
    setEnding(true);
    try {
      await fetch(`/api/lives/${transmisionId}/end`, { method: 'PATCH' });
      onEndStream?.();
    } catch {
      setEnding(false);
    }
  };

  const isStreamer = stream?.usuario_id === usuario?.id;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col p-4 gap-4 min-w-0">
        <div className="flex-1 relative">
          <LiveStream
            stream={stream}
            currentAlert={currentAlert}
          />
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
              {stream?.username?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{stream?.username || 'Streamer'}</p>
              <p className="text-gray-400 text-xs">{stream?.categoria || 'General'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPayments(true)}
              className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Wallet size={16} />
              {balance}
            </button>
            <button
              onClick={() => setShowGifts(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Gift size={16} />
              Regalar
            </button>
            {isStreamer && (
              <button
                onClick={handleEndStream}
                disabled={ending}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {ending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Square size={16} />
                )}
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 shrink-0 border-l border-gray-800 dark:border-gray-800 border-gray-200">
        <ChatPanel transmisionId={transmisionId} />
      </div>

      <GiftModal
        isOpen={showGifts}
        onClose={() => setShowGifts(false)}
        transmisionId={transmisionId}
        userBalance={balance}
      />

      <PaymentModal
        isOpen={showPayments}
        onClose={() => setShowPayments(false)}
        usuarioId={usuario.id}
        onBalanceUpdate={setBalance}
      />
    </div>
  );
}
