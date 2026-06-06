"use client";

import { User, Bot } from "lucide-react";
import { isArabic, cleanAiResponse } from "@/lib/text-utils";
import ResponseMetaDialog from "./response-meta-dialog";
import type { ChatMessage, ResponseMeta } from "@/lib/chat";

const URL_RE = /https?:\/\/\S+/g;

function TextWithLinks({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const url = match[0].replace(/[.,،؛;)\]]+$/, ""); // strip trailing punctuation
    parts.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
        className="text-violet-400 hover:text-violet-300 underline break-all transition-colors"
      >
        {url}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

type ChatBubbleProps = {
  message: ChatMessage;
  meta?: ResponseMeta;
  disclaimer?: string;
  retrievedContext?: string;
};

export default function ChatBubble({
  message,
  meta,
  disclaimer,
  retrievedContext,
}: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    const rtl = isArabic(message.content);
    return (
      <div className="flex gap-3 items-end flex-row-reverse">
        <div className="shrink-0 size-8 rounded-full flex items-center justify-center bg-emerald-600">
          <User className="size-5 text-white" />
        </div>
        <div
          dir={rtl ? "rtl" : "ltr"}
          className="w-fit max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-emerald-600 text-zinc-100"
        >
          {message.content}
        </div>
      </div>
    );
  }

  const { mainText, questions, referencesText } = cleanAiResponse(message.content);
  const rtl = isArabic(mainText);
  const webSources = meta?.web_sources ?? [];
console.log(questions);
console.log(mainText);
console.log(message.content);

  return (
    <div className="flex gap-3 items-start flex-row">
      <div className="shrink-0 size-8 rounded-full flex items-center justify-center bg-violet-600 mt-1">
        <Bot className="size-5 text-white" />
      </div>

      <div className="flex-1 min-w-0 max-w-[90%] flex flex-col gap-2">
        {/* Main answer */}
        <div
          dir={rtl ? "rtl" : "ltr"}
          lang={rtl ? "ar" : undefined}
          className="rounded-2xl px-4 py-3 text-sm bg-[#4B4F5B] text-zinc-100 leading-relaxed whitespace-pre-wrap"
        >
          <TextWithLinks text={mainText} />
        </div>

        {/* Suggested questions — plain text */}
        {questions.length > 0 && (
          <div
            dir="rtl"
            lang="ar"
            className="rounded-2xl px-4 py-3 text-sm bg-[#4B4F5B] text-zinc-100 leading-relaxed flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5">
              <span>💡</span>
              <span className="font-semibold text-zinc-200">أسئلة مقترحة</span>
            </div>
            {questions.map((q, i) => (
              <p key={i} className="text-zinc-300">
                • {q}
              </p>
            ))}
          </div>
        )}

        {/* References extracted from answer text */}
        {referencesText && (
          <div
            dir="rtl"
            lang="ar"
            className="rounded-2xl px-4 py-3 text-sm bg-[#4B4F5B] text-zinc-100 leading-relaxed whitespace-pre-wrap"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span>📚</span>
              <span className="font-semibold text-zinc-200">المراجع</span>
            </div>
            <TextWithLinks text={referencesText} />
          </div>
        )}

        {/* References */}
        {/* {webSources.length > 0 && (
          <div className="rounded-xl bg-[#4B4F5B]/60 px-4 py-3 flex flex-col gap-2.5">
            <p dir="rtl" className="text-sm font-semibold text-zinc-200">📚 المراجع</p>
            {webSources.map((src, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <a
                  dir="rtl"
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  {src.title ?? src.url}
                </a>
                <p
                  style={{ direction: "ltr", unicodeBidi: "isolate" }}
                  className="text-xs text-zinc-500 break-all"
                >
                  {src.url}
                </p>
                {src.snippet && (
                  <p
                    dir={isArabic(src.snippet) ? "rtl" : "ltr"}
                    lang={isArabic(src.snippet) ? "ar" : undefined}
                    className="text-xs text-zinc-400 leading-relaxed line-clamp-2"
                  >
                    {src.snippet}
                  </p>
                )}
              </div>
            ))}
          </div>
        )} */}

        {/* Disclaimer */}
        {/* {disclaimer && (
          <div
            dir="rtl"
            className="flex gap-2 rounded-xl bg-amber-950/40 border border-amber-800/30 px-4 py-3"
          >
            <p
              lang={isArabic(disclaimer) ? "ar" : undefined}
              className="text-xs text-amber-300/90 leading-relaxed"
            >
              {disclaimer}
            </p>
            <span className="text-amber-400 shrink-0 mt-0.5 text-sm">⚠</span>
          </div>
        )} */}

        {/* Monitoring dialog */}
        {meta && (
          <ResponseMetaDialog
            meta={meta}
            disclaimer={disclaimer}
            retrievedContext={retrievedContext ?? message.retrievedContext}
          />
        )}
      </div>
    </div>
  );
}
