export default function GiftAlert({ alert }) {
  if (!alert) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      <div className="animate-gift-alert bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl px-8 py-6 shadow-2xl text-center">
        <div className="text-6xl mb-3">{alert.regalo.icono_url}</div>
        <p className="text-white text-lg font-bold drop-shadow-lg">
          ¡Regalo de {alert.regalo.nombre}!
        </p>
        <p className="text-white/80 text-sm">
          {alert.regalo.costo_monedas} monedas
        </p>
      </div>
    </div>
  );
}
