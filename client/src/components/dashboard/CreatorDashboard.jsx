import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Eye, Coins, Clock, TrendingUp } from 'lucide-react';

export default function CreatorDashboard({ usuarioId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuarioId) return;
    setLoading(true);
    fetch(`/api/stats/${usuarioId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar estadísticas');
        return r.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [usuarioId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-72 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p className="text-red-400 text-lg mb-2">Error al cargar estadísticas</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalViewers = data.historicoEspectadores?.reduce((a, b) => a + Number(b.espectadores), 0) || 0;
  const totalRevenue = data.ingresosRegalos?.reduce((a, b) => a + Number(b.ingresos), 0) || 0;
  const totalMinutes = data.minutosTransmitidos?.reduce((a, b) => a + Number(b.minutos_estimados), 0) || 0;

  const statCards = [
    { label: 'Espectadores totales', value: totalViewers.toLocaleString(), icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Ingresos por regalos', value: `${totalRevenue.toLocaleString()} monedas`, icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Minutos transmitidos', value: totalMinutes.toLocaleString(), icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="p-6 overflow-y-auto h-full scrollbar-thin">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} className="text-red-500" />
        <h1 className="text-2xl font-bold text-white">Panel de Estadísticas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Espectadores Históricos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.historicoEspectadores || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="espectadores" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Ingresos por Regalos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.ingresosRegalos || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="ingresos" fill="#EAB308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Minutos Transmitidos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.minutosTransmitidos || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="minutos_estimados" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Top Regalos Recibidos</h3>
          {data.topRegalos?.length > 0 ? (
            <div className="space-y-3">
              {data.topRegalos.map((regalo, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{regalo.icono_url}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{regalo.nombre}</p>
                      <p className="text-gray-400 text-xs">{regalo.veces_enviado}x enviado</p>
                    </div>
                  </div>
                  <span className="text-yellow-400 text-sm font-semibold">{regalo.total_gastado} monedas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aún no has recibido regalos</p>
          )}
        </div>
      </div>
    </div>
  );
}
