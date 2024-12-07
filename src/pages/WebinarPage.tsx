import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import LiveChat from '../components/LiveChat';
import { useWebinar } from '../context/WebinarContext';

const WebinarPage: React.FC = () => {
  const { slug } = useParams();
  const { webinars, setCurrentWebinar } = useWebinar();
  const webinar = webinars.find(w => w.slug === slug);

  useEffect(() => {
    if (webinar) {
      setCurrentWebinar(webinar);
    }
  }, [webinar, setCurrentWebinar]);

  if (!webinar) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Webinar não encontrado</h1>
          <p className="text-gray-600">O webinar que você está procurando não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{webinar.title}</h1>
          <p className="text-gray-600 mt-2">{webinar.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer webinar={webinar} />
          </div>
          <div className="h-[600px]">
            <LiveChat webinar={webinar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarPage;