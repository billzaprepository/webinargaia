import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, ExternalLink, Check } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import { useAuth } from '../context/AuthContext';
import VideoUpload from './VideoUpload';

const WebinarForm: React.FC = () => {
  const navigate = useNavigate();
  const { addWebinar } = useWebinar();
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [webinarLink, setWebinarLink] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    startTime: '',
    endTime: '',
    video: null as File | null,
  });

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startTime || !formData.endTime) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      setError('A data de término deve ser posterior à data de início');
      return;
    }

    const slug = generateSlug(formData.title);

    const newWebinar = {
      slug,
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1600&h=900',
      schedule: {
        startTime,
        endTime,
        title: formData.title,
        description: formData.description,
        status: 'scheduled',
        slug // Add slug to schedule
      },
      messages: [],
      video: formData.video,
      createdBy: currentUser?.id || '',
      isActive: true,
      ctaButtons: [],
      theme: {
        primaryColor: '#3B82F6',
        backgroundColor: '#F3F4F6',
        headerColor: '#1F2937',
        chatBackgroundColor: '#FFFFFF',
        chatTextColor: '#374151',
        fontFamily: 'Inter, sans-serif'
      }
    };

    const createdWebinar = addWebinar(newWebinar);
    
    if (createdWebinar) {
      const link = `/webinar/${slug}`;
      setWebinarLink(link);
      setSuccess(true);
    }
  };

  const handleViewWebinar = () => {
    navigate(webinarLink);
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Webinar Criado com Sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Clique no botão abaixo para acessar seu webinar:
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voltar para o Painel
            </button>
            <button
              onClick={handleViewWebinar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Acessar Webinar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Video size={24} />
        Criar Novo Webinar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Webinar
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Thumbnail (opcional)
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora de Início
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora de Término
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vídeo do Webinar
            </label>
            <VideoUpload
              onVideoChange={(file) => setFormData(prev => ({ ...prev, video: file }))}
              currentVideo={formData.video}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Webinar
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebinarForm;