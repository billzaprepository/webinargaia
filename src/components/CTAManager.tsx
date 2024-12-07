import React, { useState } from 'react';
import { Plus, Trash2, Clock, Link as LinkIcon, Edit2, X, Save } from 'lucide-react';
import { CTAButton } from '../types/webinar';

interface CTAManagerProps {
  ctaButtons: CTAButton[];
  onUpdate: (buttons: CTAButton[]) => void;
}

const defaultButtonState: CTAButton = {
  id: '',
  text: '',
  url: '',
  color: '#3B82F6',
  backgroundColor: '#000000',
  opacity: '40',
  position: 'above',
  showAt: 0,
  duration: 300
};

const CTAManager: React.FC<CTAManagerProps> = ({ ctaButtons, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newButton, setNewButton] = useState<CTAButton>(defaultButtonState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      handleSaveEdit();
    } else {
      handleAddButton();
    }
  };

  const handleAddButton = () => {
    const button: CTAButton = {
      ...newButton,
      id: Math.random().toString(36).substr(2, 9)
    };
    onUpdate([...ctaButtons, button]);
    resetForm();
  };

  const handleEditButton = (button: CTAButton) => {
    setEditingId(button.id);
    setNewButton({
      ...button,
      opacity: button.opacity || '40'
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updatedButtons = ctaButtons.map(button => 
      button.id === editingId ? { ...newButton } : button
    );
    
    onUpdate(updatedButtons);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewButton(defaultButtonState);
  };

  const handleCancelEdit = () => {
    resetForm();
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex gap-2">
              <input
                type="color"
                value={newButton.color}
                onChange={(e) => setNewButton(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={newButton.color}
                onChange={(e) => setNewButton(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor de Fundo do Timer
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={newButton.backgroundColor || '#000000'}
                onChange={(e) => setNewButton(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={newButton.backgroundColor || '#000000'}
                onChange={(e) => setNewButton(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacidade do Timer
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newButton.opacity || '40'}
              onChange={(e) => setNewButton(prev => ({ ...prev, opacity: e.target.value }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span>{newButton.opacity || '40'}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posição do Timer
            </label>
            <select
              value={newButton.position || 'above'}
              onChange={(e) => setNewButton(prev => ({ ...prev, position: e.target.value as CTAButton['position'] }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="above">Acima do botão</option>
              <option value="below">Abaixo do botão</option>
              <option value="left">À esquerda do botão</option>
              <option value="right">À direita do botão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mostrar após (segundos)
            </label>
            <input
              type="number"
              min="0"
              value={newButton.showAt}
              onChange={(e) => setNewButton(prev => ({ ...prev, showAt: parseInt(e.target.value) || 0 }))}
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
              onChange={(e) => setNewButton(prev => ({ ...prev, duration: parseInt(e.target.value) || 300 }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                onClick={handleCancelEdit}
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
              Adicionar Botão CTA
            </button>
          )}
        </div>
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
                  <div className="mt-1 text-sm text-gray-500">
                    Timer: {button.position === 'above' ? 'Acima' : button.position === 'below' ? 'Abaixo' : button.position === 'left' ? 'Esquerda' : 'Direita'} | 
                    Opacidade: {button.opacity || '40'}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditButton(button)}
                  className="text-blue-500 hover:text-blue-700 p-2"
                  disabled={editingId !== null}
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleRemoveButton(button.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  disabled={editingId !== null}
                >
                  <Trash2 size={20} />
                </button>
              </div>
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