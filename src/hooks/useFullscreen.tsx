import { useState, useCallback, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface UseFullscreenResult {
  isFullscreen: boolean;
  open: () => void;
  close: () => void;
  FullscreenOverlay: ({ children }: { children: ReactNode }) => React.ReactElement | null;
}

function FullscreenOverlay({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 border border-foreground/50 rounded-lg text-foreground hover:bg-accent hover:border-accent hover:text-background transition-colors"
        aria-label="Close fullscreen view"
      >
        <X className="w-5 h-5" />
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function useFullscreen(): UseFullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const open = useCallback(() => setIsFullscreen(true), []);
  const close = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const Overlay = useCallback(
    ({ children }: { children: ReactNode }) => (
      <FullscreenOverlay isOpen={isFullscreen} onClose={close}>{children}</FullscreenOverlay>
    ),
    [isFullscreen, close]
  );

  return { isFullscreen, open, close, FullscreenOverlay: Overlay };
}
