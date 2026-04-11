"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Terminal, ScanLine, AlertCircle } from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";
import AsciiPreview from "@/components/AsciiPreview";
import ConversionControls from "@/components/ConversionControls";
import { imageToAscii, CHARSETS } from "@/utils/imageToAscii";

const DEBOUNCE_MS = 300;

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ascii, setAscii] = useState<string>("");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxWidth, setMaxWidth] = useState(120);
  const [charset, setCharset] = useState("Classic");
  const [structure, setStructure] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convert = useCallback(async (src: string, width: number, cs: string, struct: boolean) => {
    setConverting(true);
    setAscii("");
    setError(null);

    try {
      const result = await imageToAscii(src, {
        maxWidth: width,
        charset: CHARSETS[cs],
        structure: struct,
      });
      setAscii(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setConverting(false);
    }
  }, []);

  const handleImageReady = useCallback((dataUrl: string) => {
    setImageSrc(dataUrl);
    convert(dataUrl, maxWidth, charset, structure);
  }, [convert, maxWidth, charset, structure]);

  useEffect(() => {
    if (!imageSrc) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      convert(imageSrc, maxWidth, charset, structure);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [maxWidth, charset, imageSrc, structure, convert]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([ascii], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [ascii]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setAscii("");
    setError(null);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-[#00ff41]" />
          <h1 className="text-2xl font-mono text-[#00ff41]">ASCII CONVERTER</h1>
        </div>
        <p className="text-sm font-mono text-[#00ff41]">Convert images to ASCII art in your browser</p>
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
                className="max-w-full max-h-[400px] lg:max-h-[75vh] object-contain rounded border border-[#00ff41]"
              />
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-[#00ff41] rounded-lg text-[#00ff41] font-mono text-sm hover:bg-[#ffb000] hover:border-[#ffb000] hover:text-[#0a0a0a] transition-colors"
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
            <p className="font-mono text-[#00ff41] animate-pulse">Converting...</p>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-[50vh] lg:h-[75vh] min-h-[400px] border-2 border-dashed border-red-500/50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="font-mono text-sm text-red-500">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-red-500 rounded-lg text-red-500 font-mono text-sm hover:bg-[#ffb000] hover:border-[#ffb000] hover:text-[#0a0a0a] transition-colors"
              >
                Try again
              </button>
            </div>
          ) : ascii ? (
            <AsciiPreview ascii={ascii} onDownload={handleDownload} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-[50vh] lg:h-[75vh] min-h-[400px] border-2 border-dashed border-[#00ff41]/30 rounded-lg">
              <ScanLine className="w-12 h-12 text-[#00ff41]/30" />
              <p className="font-mono text-sm text-[#00ff41]/50">
                Upload an image to see ASCII art
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs font-mono text-[#00ff41]">It&apos;s free, it&apos;s safe, it&apos;s cool</p>
    </div>
  );
}
