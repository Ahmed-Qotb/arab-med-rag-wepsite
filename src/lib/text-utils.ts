// Returns true when the majority of non-whitespace characters are Arabic/RTL script.
export function isArabic(text: string): boolean {
  if (!text) return false;
  const nonSpace = text.replace(/\s/g, "");
  if (nonSpace.length === 0) return false;
  const arabic = nonSpace.match(/[؀-ۿݐ-ݿࢠ-ࣿ]/g);
  return !!arabic && arabic.length / nonSpace.length > 0.25;
}

export type ParsedAiResponse = {
  mainText: string;
  questions: string[];
  referencesText: string;
};

type SectionEntry = {
  index: number;
  type: "questions" | "retrieval" | "references";
  markerLen: number;
};

// Each regex matches the section header in any formatting the API might produce.
// The full match length becomes markerLen so we skip past the entire header.

const QUESTION_PATTERNS: RegExp[] = [
  /أسئلة مقترحة/,
  /اسئلة مقترحة/,
  /الأسئلة المقترحة/,
  /Suggested Questions/i,
  /Related Questions/i,
];

// 📚 followed by anything up to end-of-line (handles *المراجع*, المراجع:, etc.)
const REFERENCE_PATTERNS: RegExp[] = [
  /📚[^\n]*/,
];

// 📑 followed by anything up to end-of-line — format-agnostic.
// Fallback text-only patterns for when the emoji is stripped.
const RETRIEVAL_PATTERNS: RegExp[] = [
  /📑[^\n]*/,
  /\*+\s*المصادر الطبية المسترجعة[^\n]*\*+/,
  /المصادر الطبية المسترجعة/,
  /المصادر المسترجعة/,
  /الوثائق المسترجعة/,
  /مصادر الاسترجاع/,
  /Retrieved Medical Sources/i,
  /Retrieved Sources/i,
  /Retrieved Documents/i,
];

function scanPatterns(
  answer: string,
  patterns: RegExp[],
  type: SectionEntry["type"],
  out: SectionEntry[]
) {
  for (const re of patterns) {
    re.lastIndex = 0;
    const m = re.exec(answer);
    if (m) out.push({ index: m.index, type, markerLen: m[0].length });
  }
}

// Drops trailing lines that have no meaningful Arabic or Latin word content
// (lone emojis, separators like "---", stray section-prefix emojis, etc.).
function stripTrailingArtifacts(text: string): string {
  const lines = text.split("\n");
  let end = lines.length;
  while (end > 0) {
    const line = lines[end - 1].trim();
    if (line && /[؀-ۿ\w]{2}/.test(line)) break;
    end--;
  }
  return lines.slice(0, end).join("\n").trim();
}

export type ParsedApiResponse = {
  cleanAnswer: string;
  retrievedContext: string;
};

/**
 * Server-side: strips the RAG retrieval section from the raw API answer
 * and returns it separately so it can be stored and inspected independently.
 */
export function parseApiResponse(answer: string): ParsedApiResponse {
  const sections: SectionEntry[] = [];
  scanPatterns(answer, RETRIEVAL_PATTERNS, "retrieval", sections);
  if (sections.length === 0) return { cleanAnswer: answer.trim(), retrievedContext: "" };
  sections.sort((a, b) => a.index - b.index);
  const first = sections[0];
  return {
    cleanAnswer: answer.slice(0, first.index).trim(),
    retrievedContext: answer.slice(first.index + first.markerLen).trim(),
  };
}

export function cleanAiResponse(answer: string): ParsedAiResponse {
  const sections: SectionEntry[] = [];
  scanPatterns(answer, QUESTION_PATTERNS, "questions", sections);
  scanPatterns(answer, REFERENCE_PATTERNS, "references", sections);
  scanPatterns(answer, RETRIEVAL_PATTERNS, "retrieval", sections);

  if (sections.length === 0) {
    return { mainText: answer.trim(), questions: [], referencesText: "" };
  }

  sections.sort((a, b) => a.index - b.index);

  // Everything before the first section marker is the main answer.
  // Strip any trailing emoji/separator artifacts the prefix chars leave behind.
  const mainText = stripTrailingArtifacts(answer.slice(0, sections[0].index));

  // Extract suggested questions (text between questions marker and next section).
  let questions: string[] = [];
  const qSection = sections.find((s) => s.type === "questions");
  if (qSection) {
    const nextSection = sections.find((s) => s.index > qSection.index);
    const end = nextSection ? nextSection.index : answer.length;
    const raw = answer.slice(qSection.index + qSection.markerLen, end).trim();
    questions = raw
      .split("\n")
      .map((line) => line.replace(/^[\s‏‎\-\*\d\.:،•]+/, "").trim())
      .filter((line) => line.length > 5 && line.length < 250 && /[؀-ۿ\w]{2}/.test(line));
  }

  // Extract user-facing references section (text between references marker and next section).
  let referencesText = "";
  const refSection = sections.find((s) => s.type === "references");
  if (refSection) {
    const nextSection = sections.find((s) => s.index > refSection.index);
    const end = nextSection ? nextSection.index : answer.length;
    referencesText = stripTrailingArtifacts(
      answer.slice(refSection.index + refSection.markerLen, end).replace(/^[::\s]+/, "")
    );
  }

  return { mainText, questions, referencesText };
}
