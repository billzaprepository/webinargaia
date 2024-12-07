import React, { useState } from 'react';
import { Plus, Trash2, Clock, User } from 'lucide-react';
import { ChatMessage } from '../types/webinar';

interface ChatManagerProps {
  messages: ChatMessage[];
  onUpdate: (messages: ChatMessage[]) => void;
}

const ChatManager: React.FC<ChatManagerProps> = ({ messages, onUpdate }) => {
  const [newMessage, setNewMessage] = useState({
    username: '',
    message: '',
    scheduledTime: 0
  });

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(Date.now() + newMessage.scheduledTime * 1000)
      .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const message: ChatMessage = {
      ...newMessage,
      id: Math.random().toString(36).substr(2, 9),
      timestamp
    };

    onUpdate([...messages, message].sort((a, b) => a.scheduledTime - b.scheduledTime));
    setNewMessage({
      username: '',
      message: '',
      scheduledTime: 0
    });
  };

  const handleRemoveMessage = (id: string) => {
    onUpdate(messages.filter(msg => msg.id !== id));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddMessage} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Usuário
            </label>
            <input
              type="text"
              value={newMessage.username}
              onChange={(e) => setNewMessage(prev => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo após início (segundos)
            </label>
            <input
              type="number"
              min="0"
              value={newMessage.scheduledTime}
              onChange={(e) => setNewMessage(prev => ({ ...prev, scheduledTime: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              value={newMessage.message}
              onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Digite a mensagem do usuário..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Adicionar Mensagem
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Mensagens Programadas</h3>
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{msg.username}</p>
                  <p className="text-gray-600">{msg.message}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>Aparece em {formatTime(msg.scheduledTime)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveMessage(msg.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma mensagem programada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManager;