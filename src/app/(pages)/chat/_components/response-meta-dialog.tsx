"use client";

import { BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isArabic } from "@/lib/text-utils";
import type { ResponseMeta } from "@/lib/chat";

type Props = { meta: ResponseMeta; disclaimer?: string; retrievedContext?: string };

function Badge({ label, variant }: { label: string; variant: "green" | "amber" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "green" && "bg-emerald-900/50 text-emerald-300",
        variant === "amber" && "bg-amber-900/50 text-amber-300",
        variant === "neutral" && "bg-zinc-700 text-zinc-300"
      )}
    >
      {label}
    </span>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-700/40 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-sm font-semibold text-zinc-200">{value}</span>
    </div>
  );
}

export default function ResponseMetaDialog({ meta, disclaimer, retrievedContext }: Props) {
  const hasBadges = meta.cache_hit || meta.halluc_warn || meta.bm25_used;
  const hasStats =
    meta.results !== undefined ||
    meta.serper_count !== undefined ||
    meta.elapsed !== undefined ||
    meta.bm25_used !== undefined ||
    meta.cache_hit !== undefined ||
    meta.halluc_warn !== undefined;
  const hasSources = (meta.web_sources?.length ?? 0) > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer self-start">
          <BarChart2 className="size-3.5" />
          تفاصيل الاستجابة
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader dir="rtl" lang="ar">
          <DialogTitle>تفاصيل الاستجابة</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-1">
          {/* Status badges */}
          {hasBadges && (
            <div className="flex flex-wrap gap-2">
              {meta.cache_hit && <Badge label="Cache Hit ✓" variant="green" />}
              {meta.halluc_warn && <Badge label="Hallucination Warning ⚠" variant="amber" />}
              {meta.bm25_used && <Badge label="BM25" variant="neutral" />}
            </div>
          )}

          {/* Stats */}
          {hasStats && (
            <div dir="ltr" className="flex flex-col bg-zinc-800/50 rounded-xl px-4 py-1">
              {meta.results !== undefined && (
                <StatRow label="Results Found" value={String(meta.results)} />
              )}
              {meta.serper_count !== undefined && (
                <StatRow label="Serper Sources" value={String(meta.serper_count)} />
              )}
              {meta.elapsed !== undefined && (
                <StatRow label="Response Time" value={`${meta.elapsed}s`} />
              )}
              {meta.bm25_used !== undefined && (
                <StatRow label="BM25 Used" value={meta.bm25_used ? "Yes" : "No"} />
              )}
              {meta.cache_hit !== undefined && (
                <StatRow label="Cache Hit" value={meta.cache_hit ? "Yes" : "No"} />
              )}
              {meta.halluc_warn !== undefined && (
                <StatRow label="Hallucination Warning" value={meta.halluc_warn ? "Yes" : "No"} />
              )}
            </div>
          )}

          {/* Web sources */}
          {hasSources && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                المصادر
              </p>
              <div className="flex flex-col gap-2">
                {meta.web_sources!.map((src, i) => {
                  const titleRtl = isArabic(src.title ?? "");
                  const snippetRtl = isArabic(src.snippet ?? "");
                  return (
                    <div key={i} className="flex flex-col gap-1 bg-zinc-800/40 rounded-xl px-3 py-2.5">
                      {src.title && (
                        <p
                          dir={titleRtl ? "rtl" : "ltr"}
                          lang={titleRtl ? "ar" : undefined}
                          className="text-sm font-medium text-zinc-200"
                        >
                          {src.title}
                        </p>
                      )}
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ direction: "ltr", unicodeBidi: "isolate" }}
                        className="text-xs text-violet-400 hover:text-violet-300 transition-colors break-all text-left block"
                      >
                        {src.url}
                      </a>
                      {src.snippet && (
                        <p
                          dir={snippetRtl ? "rtl" : "ltr"}
                          lang={snippetRtl ? "ar" : undefined}
                          className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mt-0.5"
                        >
                          {src.snippet}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-950/40 border border-amber-800/30 px-4 py-3">
              <span className="text-amber-400 shrink-0 mt-0.5 text-sm">⚠</span>
              <p
                dir={isArabic(disclaimer) ? "rtl" : "ltr"}
                lang={isArabic(disclaimer) ? "ar" : undefined}
                className="text-xs text-amber-300/90 leading-relaxed"
              >
                {disclaimer}
              </p>
            </div>
          )}

          {/* Retrieved context (RAG chunks) — debug only */}
          {retrievedContext && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Retrieved Context
              </p>
              <pre className="text-xs text-zinc-400 bg-zinc-900/60 rounded-xl px-3 py-2.5 whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-y-auto">
                {retrievedContext}
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!hasBadges && !hasStats && !hasSources && !disclaimer && !retrievedContext && (
            <p className="text-sm text-zinc-500 text-center py-4">لا توجد بيانات متاحة</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
