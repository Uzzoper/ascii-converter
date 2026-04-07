"use client";

import { useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";

interface Props {
  onImageReady: (dataUrl: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageReady(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageReady]);

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
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-4
        w-full max-w-xl h-64
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
  );
}
