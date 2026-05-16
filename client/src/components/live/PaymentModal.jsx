import { useState, useEffect } from 'react';
import { X, Coins, Sparkles } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, usuarioId, onBalanceUpdate }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/payments/packages')
      .then((r) => r.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  const handlePurchase = async (pkg) => {
    setProcessing(pkg.id);
    try {
      const res = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, package_id: pkg.id }),
      });
      const data = await res.json();
      if (res.ok) {
        onBalanceUpdate?.(data.usuario.balance_monedas);
        setTimeout(() => onClose(), 1000);
      }
    } catch {
      // manejar error
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-sm mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Recargar Monedas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePurchase(pkg)}
                disabled={processing === pkg.id}
                className={`w-full flex items-center justify-between p-4 rounded-xl border border-gray-700 bg-gray-800 hover:border-yellow-500 transition-all ${
                  processing === pkg.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Coins size={20} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold flex items-center gap-2">
                      {pkg.monedas} monedas
                      {pkg.id === packages[packages.length - 1]?.id && (
                        <Sparkles size={14} className="text-yellow-400" />
                      )}
                    </p>
                    <p className="text-xs text-gray-400">${pkg.precio.toFixed(2)} USD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm font-medium">
                    {processing === pkg.id ? 'Procesando...' : `$${pkg.precio.toFixed(2)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(pkg.monedas / pkg.precio).toFixed(0)} monedas/USD
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
