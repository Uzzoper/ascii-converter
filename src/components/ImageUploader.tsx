"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, AlertCircle, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  onImageReady: (dataUrl: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const clearError = useCallback(() => setError(null), []);

  const handleFile = useCallback((file: File) => {
    clearError();
    
    if (!file.type.startsWith("image/")) {
      setError(t("upload.error.invalid"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageReady(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageReady, clearError, t]);

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
    <div className="flex flex-col w-full gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          flex flex-col items-center justify-center gap-4
          container-height
          border-2 border-dashed rounded-lg
          cursor-pointer transition-colors
          ${isDragging
            ? "border-accent bg-accent/10"
            : "border-foreground hover:border-accent"
          }
        `}
      >
        <Upload className="w-12 h-12 text-foreground" />
        <div className="text-center font-mono text-sm text-foreground">
          <p>{t("upload.dropzone")}</p>
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
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-2 border-dashed border-error/50 rounded-lg bg-error/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-error" />
            <span className="font-mono text-sm text-error">{error}</span>
          </div>
          <button onClick={clearError} className="text-error hover:text-error/80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
