import React, { useState } from 'react';
import { Plus, Trash2, Clock, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';
import { CTAButton } from '../types/webinar';

interface CTAManagerProps {
  ctaButtons: CTAButton[];
  onUpdate: (buttons: CTAButton[]) => void;
}

const CTAManager: React.FC<CTAManagerProps> = ({ ctaButtons, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newButton, setNewButton] = useState<CTAButton>({
    id: '',
    text: '',
    url: '',
    color: '#3B82F6',
    backgroundColor: '#000000',
    opacity: '40',
    position: 'above',
    showAt: 0,
    duration: 300
  });

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
    setNewButton(button);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updatedButtons = ctaButtons.map(button => 
      button.id === editingId ? { ...newButton } : button
    );
    
    onUpdate(updatedButtons);
    resetForm();
  };

  const handleRemoveButton = (id: string) => {
    onUpdate(ctaButtons.filter(button => button.id !== id));
  };

  const resetForm = () => {
    setEditingId(null);
    setNewButton({
      id: '',
      text: '',
      url: '',
      color: '#3B82F6',
      backgroundColor: '#000000',
      opacity: '40',
      position: 'above',
      showAt: 0,
      duration: 300
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <LinkIcon size={24} />
        Botões de CTA
      </h2>

      <div className="space-y-6">
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
                value={newButton.backgroundColor}
                onChange={(e) => setNewButton(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={newButton.backgroundColor}
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
              value={parseInt(newButton.opacity)}
              onChange={(e) => setNewButton(prev => ({ ...prev, opacity: e.target.value }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span>{newButton.opacity}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posição do Timer
            </label>
            <select
              value={newButton.position}
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
              onChange={(e) => setNewButton(prev => ({ ...prev, showAt: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleAddButton}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar Botão CTA
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Botões Programados</h3>
          {ctaButtons.length > 0 ? (
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
                          Aparece em {button.showAt}s por {button.duration}s
                        </span>
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
            </div>
          ) : (
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