import React, { useState } from 'react';
import { Plus, Trash2, Clock, Link as LinkIcon } from 'lucide-react';
import { CTAButton } from '../types/webinar';

interface CTAManagerProps {
  ctaButtons: CTAButton[];
  onUpdate: (buttons: CTAButton[]) => void;
}

const CTAManager: React.FC<CTAManagerProps> = ({ ctaButtons, onUpdate }) => {
  const [newButton, setNewButton] = useState({
    text: '',
    url: '',
    color: '#3B82F6',
    showAt: 0,
    duration: 300
  });

  const handleAddButton = (e: React.FormEvent) => {
    e.preventDefault();
    const button: CTAButton = {
      ...newButton,
      id: Math.random().toString(36).substr(2, 9)
    };
    onUpdate([...ctaButtons, button]);
    setNewButton({
      text: '',
      url: '',
      color: '#3B82F6',
      showAt: 0,
      duration: 300
    });
  };

  const handleRemoveButton = (id: string) => {
    onUpdate(ctaButtons.filter(button => button.id !== id));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddButton} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto do Botão
            </label>
            <input
              type="text"
              value={newButton.text}
              onChange={(e) => setNewButton(prev => ({ ...prev, text: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Comprar Agora"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Destino
            </label>
            <input
              type="url"
              value={newButton.url}
              onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor do Botão
            </label>
            <input
              type="color"
              value={newButton.color}
              onChange={(e) => setNewButton(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mostrar após (segundos)
            </label>
            <input
              type="number"
              min="0"
              value={newButton.showAt}
              onChange={(e) => setNewButton(prev => ({ ...prev, showAt: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (segundos)
            </label>
            <input
              type="number"
              min="1"
              value={newButton.duration}
              onChange={(e) => setNewButton(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Adicionar Botão CTA
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Botões Programados</h3>
        <div className="space-y-3">
          {ctaButtons.map(button => (
            <div key={button.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: button.color }}
                />
                <div>
                  <p className="font-medium text-gray-800">{button.text}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <LinkIcon size={14} />
                      {button.url}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Aparece em {formatTime(button.showAt)} por {button.duration}s
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveButton(button.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {ctaButtons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum botão CTA programado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTAManager;