import React, { useState } from 'react';
import { Check, X, Edit2, Save } from 'lucide-react';
import { UserFunctionality } from '../types/user';
import { DEFAULT_FUNCTIONALITIES } from '../utils/functionalities';

interface FunctionalityManagerProps {
  enabledFunctionalities: string[];
  onUpdate: (functionalities: string[]) => void;
  readOnly?: boolean;
}

const FunctionalityManager: React.FC<FunctionalityManagerProps> = ({
  enabledFunctionalities,
  onUpdate,
  readOnly = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
  }>({ name: '', description: '' });

  const handleToggle = (functionalityId: string) => {
    if (readOnly) return;

    const newFunctionalities = enabledFunctionalities.includes(functionalityId)
      ? enabledFunctionalities.filter(id => id !== functionalityId)
      : [...enabledFunctionalities, functionalityId];
    
    onUpdate(newFunctionalities);
  };

  const handleEdit = (functionality: UserFunctionality) => {
    setEditingId(functionality.id);
    setEditForm({
      name: functionality.name,
      description: functionality.description
    });
  };

  const handleSave = (functionalityId: string) => {
    // Here you would typically update the functionality in your global state
    // For now, we'll just close the edit form
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Funcionalidades</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_FUNCTIONALITIES.map((functionality) => (
          <div
            key={functionality.id}
            className={`p-4 rounded-lg border ${
              enabledFunctionalities.includes(functionality.id)
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {editingId === functionality.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Funcionalidade
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSave(functionality.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Save size={16} />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{functionality.name}</h4>
                  <p className="text-sm text-gray-600">{functionality.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <button
                      onClick={() => handleEdit(functionality)}
                      className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggle(functionality.id)}
                    className={`p-1 rounded-full ${
                      enabledFunctionalities.includes(functionality.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {enabledFunctionalities.includes(functionality.id) ? (
                      <Check size={16} />
                    ) : (
                      <X size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunctionalityManager;