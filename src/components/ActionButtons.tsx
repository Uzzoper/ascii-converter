"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Download, Maximize2 } from "lucide-react";
import CopyToast from "./CopyToast";

interface Props {
  ascii: string;
  onDownload: () => void;
  onFullscreen: () => void;
}

export default function ActionButtons({ ascii, onDownload, onFullscreen }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const htmlContent = `<pre style="font-family: monospace; white-space: pre; color: var(--color-foreground); background: var(--color-background);">${ascii}</pre>`;
    
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([ascii], { type: "text/plain" }),
          "text/html": new Blob([htmlContent], { type: "text/html" })
        })
      ]);
      
      setIsCopied(true);
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setCopyError(true);
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => setCopyError(false), 3000);
    }
  }, [ascii]);

  return (
    <div className="flex flex-col items-center lg:items-end gap-2">
      <div className="flex flex-wrap justify-center lg:justify-end gap-2">
        {copyError ? (
          <p className="text-error text-sm font-mono">Browser not supported. Use Download instead.</p>
        ) : (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 btn-primary"
          >
            <Copy className="w-4 h-4" />
            {isCopied ? "Copied!" : "Copy"}
          </button>
        )}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 btn-primary"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
        <button
          onClick={onFullscreen}
          className="flex items-center gap-2 btn-primary"
        >
          <Maximize2 className="w-4 h-4" />
          Fullscreen
        </button>
      </div>
      <CopyToast show={isCopied} />
    </div>
  );
}
