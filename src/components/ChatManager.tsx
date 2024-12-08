import React, { useState } from 'react';
import { Plus, Trash2, Clock, User, Edit2, X, Save } from 'lucide-react';
import { ChatMessage } from '../types/webinar';

interface ChatManagerProps {
  messages: ChatMessage[];
  onUpdate: (messages: ChatMessage[]) => void;
}

const ChatManager: React.FC<ChatManagerProps> = ({ messages, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState({
    username: '',
    message: '',
    scheduledTime: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      handleSaveEdit();
    } else {
      handleAddMessage();
    }
  };

  const handleAddMessage = () => {
    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      username: newMessage.username,
      message: newMessage.message,
      scheduledTime: newMessage.scheduledTime,
      timestamp: new Date(Date.now() + newMessage.scheduledTime * 1000)
        .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onUpdate([...messages, message].sort((a, b) => a.scheduledTime - b.scheduledTime));
    resetForm();
  };

  const handleEditMessage = (message: ChatMessage) => {
    setEditingId(message.id);
    setNewMessage({
      username: message.username,
      message: message.message,
      scheduledTime: message.scheduledTime
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const updatedMessages = messages.map(msg => 
      msg.id === editingId
        ? {
            ...msg,
            username: newMessage.username,
            message: newMessage.message,
            scheduledTime: newMessage.scheduledTime,
            timestamp: new Date(Date.now() + newMessage.scheduledTime * 1000)
              .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          }
        : msg
    );

    onUpdate(updatedMessages.sort((a, b) => a.scheduledTime - b.scheduledTime));
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewMessage({
      username: '',
      message: '',
      scheduledTime: 0
    });
  };

  const handleRemoveMessage = (id: string) => {
    onUpdate(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <User size={24} />
        Gerenciar Mensagens do Chat
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar Mensagem
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Mensagens Programadas</h3>
        {messages.length > 0 ? (
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
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock size={14} />
                      <span>Aparece em {msg.scheduledTime}s</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditMessage(msg)}
                    className="text-blue-500 hover:text-blue-700 p-2"
                    disabled={editingId !== null}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleRemoveMessage(msg.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    disabled={editingId !== null}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma mensagem programada.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManager;