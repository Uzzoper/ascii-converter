"use client";

import { Info } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  show: boolean;
}

export default function CopyToast({ show }: Props) {
  const { t } = useI18n();

  if (!show) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-foreground bg-surface px-2 py-1 rounded border border-border-subtle whitespace-nowrap">
      <Info className="w-3 h-3" />
      {t("toast.copy_hint")}
    </div>
  );
}
