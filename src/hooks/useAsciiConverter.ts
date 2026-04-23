import { useState, useCallback, useEffect, useRef } from "react";
import { imageToAsciiFrame, CHARSETS } from "@/utils/imageToAscii";
import { AsciiColorMode, AsciiFrame, asciiFrameToText } from "@/utils/asciiFrame";
import { asciiToPng } from "@/utils/asciiToPng";
import { useI18n } from "@/i18n/I18nProvider";

const DEBOUNCE_MS = 300;

export function useAsciiConverter() {
  const { t } = useI18n();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [asciiFrame, setAsciiFrame] = useState<AsciiFrame | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxWidth, setMaxWidth] = useState(120);
  const [charset, setCharset] = useState("Classic");
  const [structure, setStructure] = useState(false);
  const [colorMode, setColorMode] = useState<AsciiColorMode>("mono");
  const [fontSize, setFontSize] = useState(10);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ascii = asciiFrame ? asciiFrameToText(asciiFrame) : "";

  const convert = useCallback(async (
    src: string,
    width: number,
    cs: string,
    struct: boolean,
    mode: AsciiColorMode
  ) => {
    setConverting(true);
    setAsciiFrame(null);
    setError(null);

    try {
      const result = await imageToAsciiFrame(src, {
        maxWidth: width,
        charset: CHARSETS[cs],
        structure: struct,
        colorMode: mode,
      });
      setAsciiFrame(result);
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
      convert(imageSrc, maxWidth, charset, structure, colorMode);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [maxWidth, charset, imageSrc, structure, colorMode, convert]);

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
    if (!asciiFrame) return;

    try {
      const blob = await asciiToPng(asciiFrame);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ascii-art.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t("state.failed"));
    }
  }, [asciiFrame, t]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setAsciiFrame(null);
    setError(null);
  }, []);

  return {
    imageSrc,
    asciiFrame,
    ascii,
    converting,
    error,
    maxWidth,
    charset,
    structure,
    colorMode,
    fontSize,
    setMaxWidth,
    setCharset,
    setStructure,
    setColorMode,
    setFontSize,
    handleImageReady,
    handleDownload,
    handleExportPng,
    handleReset,
  };
}
