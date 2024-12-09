import React, { useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useVideoUpload } from '../hooks/useVideoUpload';
import { VideoMetadata } from '../services/VideoStorageService';

interface VideoUploadProps {
  onVideoChange: (metadata: VideoMetadata) => void;
  currentVideo: File | null;
  maxSize?: number; // in GB
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoChange, currentVideo, maxSize = 2 }) => {
  const { uploadVideo, isUploading, progress, error } = useVideoUpload();
  
  const handleUpload = useCallback(async (file: File) => {
    try {
      // Validate file size
      const maxSizeBytes = maxSize * 1024 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${maxSize}GB limit`);
      }

      const metadata = await uploadVideo(file);
      onVideoChange(metadata);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [uploadVideo, onVideoChange, maxSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {isUploading ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {progress}%
              </p>
            </div>
          </div>
        </div>
      ) : currentVideo ? (
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
              onClick={() => onVideoChange(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer block text-center"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop a video here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, WebM or Ogg (max. {maxSize}GB)
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;