"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, AlertCircle, X } from "lucide-react";

interface Props {
  onImageReady: (dataUrl: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleFile = useCallback((file: File) => {
    clearError();
    
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageReady(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageReady, clearError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }, [handleFile]);

  return (
    <div className="flex flex-col w-full max-w-xl gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          flex flex-col items-center justify-center gap-4
          h-64 lg:h-[60vh]
          border-2 border-dashed rounded-lg
          cursor-pointer transition-colors
          ${isDragging
            ? "border-[#ffb000] bg-[#ffb000]/10"
            : "border-[#00ff41] hover:border-[#ffb000]"
          }
        `}
      >
        <Upload className="w-12 h-12 text-[#00ff41]" />
        <div className="text-center font-mono text-sm text-[#00ff41]">
          <p>Drag & drop an image or click to upload</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      {error && (
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-2 border-dashed border-red-500 rounded-lg bg-red-500/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-mono text-sm text-red-500">{error}</span>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
