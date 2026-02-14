import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { UploadedImage, BoundingBox } from '../types';

interface UploadSectionProps {
  onImageSelected: (image: UploadedImage) => void;
  onClear: () => void;
  currentImage: UploadedImage | null;
  isAnalyzing: boolean;
  boundingBox?: BoundingBox | null;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onImageSelected, 
  onClear, 
  currentImage,
  isAnalyzing,
  boundingBox
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件。');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix for API
      const base64Content = base64String.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: base64String,
        base64: base64Content
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  if (currentImage) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 relative animate-in fade-in zoom-in duration-300">
        <div className="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center relative group min-h-[200px] p-2">
          
          <div className="relative inline-block">
            <img 
              src={currentImage.previewUrl} 
              alt="Homework Preview" 
              className="max-w-full max-h-[500px] w-auto h-auto rounded-lg shadow-sm block"
            />
            {boundingBox && (
              <div 
                className="absolute border-[3px] border-red-500 bg-red-500/10 rounded-md shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 animate-pulse pointer-events-none"
                style={{
                  top: `${(boundingBox.ymin / 1000) * 100}%`,
                  left: `${(boundingBox.xmin / 1000) * 100}%`,
                  height: `${(boundingBox.ymax - boundingBox.ymin) / 1000 * 100}%`,
                  width: `${(boundingBox.xmax - boundingBox.xmin) / 1000 * 100}%`,
                }}
              />
            )}
          </div>

          {!isAnalyzing && (
            <button 
              onClick={onClear}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 z-20"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
           <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]">
             {currentImage.file.name}
           </span>
           <span className="text-xs text-slate-400">
             {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
           </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 transition-all duration-200 cursor-pointer
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        id="file-upload" 
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          上传作业图片
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          点击或拖拽图片到此处。支持 JPG, PNG, WebP 格式。
        </p>
      </label>
    </div>
  );
};