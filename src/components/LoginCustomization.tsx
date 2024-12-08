import React, { useState } from 'react';
import { Image, Type, Save, Upload, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const LoginCustomization: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [logo, setLogo] = useState<File | null>(settings.loginSettings?.logo || null);
  const [logoPreview, setLogoPreview] = useState<string>(settings.loginSettings?.logoUrl || '');
  const [title, setTitle] = useState(settings.loginSettings?.title || 'Acesso Administrativo');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview('');
  };

  const handleSave = () => {
    setIsSaving(true);
    updateSettings({
      loginSettings: {
        logo,
        logoUrl: logoPreview,
        title
      }
    });
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Image size={24} />
        Personalização da Página de Login
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo da Plataforma
          </label>
          
          {logoPreview ? (
            <div className="mb-4">
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-auto object-contain rounded-lg"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <Upload size={20} />
              Selecionar Logo
            </label>
            {logo && (
              <span className="text-sm text-gray-600">
                {logo.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Recomendado: PNG ou SVG com fundo transparente, máximo 2MB
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Página
          </label>
          <div className="flex items-center gap-2">
            <Type size={20} className="text-gray-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Acesso Administrativo"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Este título será exibido no topo da página de login
          </p>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              isSaving 
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <Save size={20} className="animate-pulse" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCustomization;