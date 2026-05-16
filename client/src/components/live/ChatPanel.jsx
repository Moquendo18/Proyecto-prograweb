import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export default function ChatPanel({ transmisionId }) {
  const { messages, sendMessage, loading, bottomRef } = useChat(transmisionId);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 dark:bg-gray-900 bg-white">
      <div className="p-3 border-b border-gray-800 dark:border-gray-800 border-gray-200 shrink-0">
        <h3 className="text-sm font-semibold text-gray-300">Chat en Vivo</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-6 h-6 bg-gray-700 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-700 rounded w-24" />
                  <div className="h-3 bg-gray-700 rounded w-40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs text-red-400 font-bold shrink-0">
              {msg.usuario.username[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs">
                <span className="text-red-400 font-medium">{msg.usuario.username}</span>
                <span className="text-gray-600 ml-1">Nv.{msg.usuario.nivel}</span>
              </p>
              <p className="text-sm text-gray-300 break-words">{msg.mensaje}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 dark:border-gray-800 border-gray-200 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-800 dark:bg-gray-800 bg-gray-100 text-sm text-white dark:text-white text-gray-900 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-red-500 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
