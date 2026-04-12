"use client";

import { Info } from "lucide-react";

interface Props {
  show: boolean;
}

export default function CopyToast({ show }: Props) {
  if (!show) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-foreground bg-surface px-2 py-1 rounded border border-border-subtle whitespace-nowrap">
      <Info className="w-3 h-3" />
      Best in terminal or code editor
    </div>
  );
}
