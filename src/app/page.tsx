"use client";

import { Terminal, ScanLine, AlertCircle } from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";
import AsciiPreview from "@/components/AsciiPreview";
import ConversionControls from "@/components/ConversionControls";
import { useAsciiConverter } from "@/hooks/useAsciiConverter";

export default function Home() {
  const {
    imageSrc,
    ascii,
    converting,
    error,
    maxWidth,
    charset,
    structure,
    setMaxWidth,
    setCharset,
    setStructure,
    handleImageReady,
    handleDownload,
    handleReset,
  } = useAsciiConverter();

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-foreground" />
          <h1 className="text-2xl font-mono text-foreground">ASCII CONVERTER</h1>
        </div>
        <p className="text-sm font-mono text-foreground text-center">Convert images to ASCII art in your browser</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <div className="flex-1 min-w-0 flex flex-col items-center gap-4">
          {!imageSrc ? (
            <ImageUploader onImageReady={handleImageReady} />
          ) : (
            <>
              <Image
                src={imageSrc}
                alt="Uploaded"
                width={400}
                height={300}
                unoptimized
                className="max-w-full max-h-[400px] lg:max-h-[75vh] object-contain rounded border border-foreground"
              />
              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Upload another image
              </button>
              <ConversionControls
                maxWidth={maxWidth}
                charset={charset}
                structure={structure}
                onMaxWidthChange={setMaxWidth}
                onCharsetChange={setCharset}
                onStructureChange={setStructure}
              />
            </>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col items-center gap-4">
          {converting ? (
            <p className="font-mono text-foreground animate-pulse">Converting...</p>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 w-full container-height border-2 border-dashed border-error/50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-error" />
              <p className="font-mono text-sm text-error">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-error rounded-lg text-error font-mono text-sm hover:bg-accent hover:border-accent hover:text-background transition-colors"
              >
                Try again
              </button>
            </div>
          ) : ascii ? (
            <AsciiPreview ascii={ascii} onDownload={handleDownload} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full container-height border-2 border-dashed border-border-subtle rounded-lg">
              <ScanLine className="w-12 h-12 text-foreground-subtle" />
              <p className="font-mono text-sm text-foreground-muted text-center">
                Upload an image to see ASCII art
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs font-mono text-foreground text-center">It&apos;s free, it&apos;s safe, it&apos;s cool</p>

      <footer className="flex flex-col items-center gap-1 mt-4 w-full">
        <p className="text-xs font-mono text-foreground text-center">
          Developed by{" "}
          <span className="text-foreground">Juan Antonio Peruzzo</span>
          {" • "}
          <a
            href="https://juanperuzzo.is-a.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent underline-offset-2 hover:underline transition-colors"
          >
            juanperuzzo.is-a.dev
          </a>
        </p>
        <p className="text-ascii font-mono text-foreground text-center">
          © 2026 ASCII Converter is a free &amp; open software
        </p>
      </footer>
    </div>
  );
}
