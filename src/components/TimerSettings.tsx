import React, { useState } from 'react';
import { Clock, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Timer } from '../types/webinar';

interface TimerSettingsProps {
  timers: Timer[];
  onUpdate: (timers: Timer[]) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ timers, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTimer, setNewTimer] = useState<Timer>({
    id: '',
    showAt: { minutes: 0, seconds: 0 },
    duration: { minutes: 5, seconds: 0 },
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    opacity: '40',
    position: 'above'
  });

  const handleAddTimer = () => {
    const timer: Timer = {
      ...newTimer,
      id: Math.random().toString(36).substr(2, 9)
    };
    onUpdate([...timers, timer]);
    resetForm();
  };

  const handleEditTimer = (timer: Timer) => {
    setEditingId(timer.id);
    setNewTimer(timer);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updatedTimers = timers.map(timer => 
      timer.id === editingId ? { ...newTimer } : timer
    );
    
    onUpdate(updatedTimers);
    resetForm();
  };

  const handleRemoveTimer = (id: string) => {
    onUpdate(timers.filter(timer => timer.id !== id));
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTimer({
      id: '',
      showAt: { minutes: 0, seconds: 0 },
      duration: { minutes: 5, seconds: 0 },
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      opacity: '40',
      position: 'above'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Clock size={24} />
        Configurações do Cronômetro
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mostrar após
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minutos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTimer.showAt.minutes}
                  onChange={(e) => setNewTimer(prev => ({
                    ...prev,
                    showAt: {
                      ...prev.showAt,
                      minutes: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Segundos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTimer.showAt.seconds}
                  onChange={(e) => setNewTimer(prev => ({
                    ...prev,
                    showAt: {
                      ...prev.showAt,
                      seconds: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minutos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTimer.duration.minutes}
                  onChange={(e) => setNewTimer(prev => ({
                    ...prev,
                    duration: {
                      ...prev.duration,
                      minutes: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Segundos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={newTimer.duration.seconds}
                  onChange={(e) => setNewTimer(prev => ({
                    ...prev,
                    duration: {
                      ...prev.duration,
                      seconds: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor do Texto
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={newTimer.textColor}
                onChange={(e) => setNewTimer(prev => ({
                  ...prev,
                  textColor: e.target.value
                }))}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={newTimer.textColor}
                onChange={(e) => setNewTimer(prev => ({
                  ...prev,
                  textColor: e.target.value
                }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor de Fundo
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={newTimer.backgroundColor}
                onChange={(e) => setNewTimer(prev => ({
                  ...prev,
                  backgroundColor: e.target.value
                }))}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={newTimer.backgroundColor}
                onChange={(e) => setNewTimer(prev => ({
                  ...prev,
                  backgroundColor: e.target.value
                }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacidade do Fundo
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(newTimer.opacity)}
              onChange={(e) => setNewTimer(prev => ({
                ...prev,
                opacity: e.target.value
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span>{newTimer.opacity}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posição
            </label>
            <select
              value={newTimer.position}
              onChange={(e) => setNewTimer(prev => ({
                ...prev,
                position: e.target.value as Timer['position']
              }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="above">Acima do botão</option>
              <option value="below">Abaixo do botão</option>
              <option value="left">À esquerda do botão</option>
              <option value="right">À direita do botão</option>
            </select>
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
              onClick={handleAddTimer}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar Cronômetro
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Cronômetros Programados</h3>
          {timers.length > 0 ? (
            <div className="space-y-3">
              {timers.map(timer => (
                <div key={timer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                      style={{
                        color: timer.textColor,
                        backgroundColor: `${timer.backgroundColor}${Math.round(parseInt(timer.opacity) * 2.55).toString(16).padStart(2, '0')}`
                      }}
                    >
                      <Clock size={14} />
                      <span>
                        {String(timer.duration.minutes).padStart(2, '0')}:
                        {String(timer.duration.seconds).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Aparece em {timer.showAt.minutes}min {timer.showAt.seconds}s
                      </p>
                      <p className="text-sm text-gray-500">
                        Duração: {timer.duration.minutes}min {timer.duration.seconds}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTimer(timer)}
                      className="text-blue-500 hover:text-blue-700 p-2"
                      disabled={editingId !== null}
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleRemoveTimer(timer.id)}
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
              Nenhum cronômetro programado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;