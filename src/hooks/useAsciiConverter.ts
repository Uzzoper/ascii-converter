import { useState, useCallback, useEffect, useRef } from "react";
import { imageToAscii, CHARSETS } from "@/utils/imageToAscii";
import { asciiToPng } from "@/utils/asciiToPng";

const DEBOUNCE_MS = 300;

export function useAsciiConverter() {
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
  }, []);

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

  const handleExportPng = useCallback(async () => {
    try {
      const blob = await asciiToPng(ascii);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ascii-art.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export PNG");
    }
  }, [ascii]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setAscii("");
    setError(null);
  }, []);

  return {
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
    handleExportPng,
    handleReset,
  };
}
