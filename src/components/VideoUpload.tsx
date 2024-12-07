import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface VideoUploadProps {
  onVideoChange: (file: File | null) => void;
  currentVideo: File | null;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoChange, currentVideo }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onVideoChange(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onVideoChange(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onVideoChange(null);
  };

  return (
    <div className="w-full">
      {!currentVideo ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Arraste e solte um vídeo aqui, ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, WebM ou Ogg (max. 2GB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <video className="h-16 w-16 rounded object-cover">
                  <source src={URL.createObjectURL(currentVideo)} type={currentVideo.type} />
                </video>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentVideo.name}</p>
                <p className="text-xs text-gray-500">
                  {(currentVideo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;