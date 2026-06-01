"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, Edit, History, Link2, Trash2, MoveRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  order: number;
  level: number;
}

interface TableOfContentsProps {
  sections: Section[];
  pageId: string;
  isOwner: boolean;
  onAddSection?: () => void;
  slug: string;
  username: string;
  versions?: { id: string; createdAt: string; summary?: string | null }[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildNumberedLabel(sections: Section[], index: number): string {
  // Assign simple numeric labels based on nesting level
  const counters: number[] = [];
  for (let i = 0; i <= index; i++) {
    const level = sections[i].level;
    if (counters.length < level) {
      while (counters.length < level) counters.push(0);
    } else if (counters.length > level) {
      counters.splice(level);
    }
    counters[level - 1] = (counters[level - 1] ?? 0) + 1;
  }
  return counters.join(".");
}

export default function TableOfContents({
  sections,
  pageId,
  isOwner,
  onAddSection,
  slug,
  username,
  versions = [],
}: TableOfContentsProps) {
  const [tocOpen, setTocOpen] = useState(true);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-56 shrink-0 sticky top-0 max-h-screen overflow-y-auto bg-white border-r border-gray-200 flex flex-col text-sm">
      {/* ───── Table of Contents ───── */}
      <div className="border-b border-gray-200">
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-gray-50"
          onClick={() => setTocOpen((v) => !v)}
        >
          <span className="font-semibold text-gray-700">목차</span>
          {tocOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>

        {tocOpen && (
          <ol className="pb-2">
            {sections.map((section, idx) => {
              const label = buildNumberedLabel(sections, idx);
              const indent = (section.level - 1) * 12;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-0.5 hover:bg-green-50 hover:text-green-800 text-gray-700 transition-colors"
                    style={{ paddingLeft: `${12 + indent}px` }}
                  >
                    <span className="text-gray-400 mr-1 text-xs">{label}.</span>
                    <span className={section.level === 1 ? "font-medium" : "text-xs"}>
                      {section.title}
                    </span>
                  </button>
                </li>
              );
            })}
            {sections.length === 0 && (
              <li className="px-3 py-1 text-gray-400 italic">섹션 없음</li>
            )}
          </ol>
        )}
      </div>

      {/* ───── Version history ───── */}
      <div className="border-b border-gray-200">
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-gray-50"
          onClick={() => setVersionsOpen((v) => !v)}
        >
          <span className="font-semibold text-gray-700">이 문서의 다른 버전</span>
          {versionsOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>

        {versionsOpen && (
          <ul className="pb-2">
            {versions.length === 0 && (
              <li className="px-3 py-1 text-gray-400 italic">버전 기록 없음</li>
            )}
            {versions.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/wiki/${username}/${slug}/version/${v.id}`}
                  className="block px-3 py-0.5 hover:bg-green-50 hover:text-green-800 text-gray-600 transition-colors"
                >
                  <span className="text-xs">{formatDate(v.createdAt)}</span>
                  {v.summary && (
                    <span className="block text-xs text-gray-400 truncate">{v.summary}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ───── Edit tools (owner only) ───── */}
      {isOwner && (
        <div className="border-b border-gray-200">
          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-gray-50"
            onClick={() => setToolsOpen((v) => !v)}
          >
            <span className="font-semibold text-gray-700">편집 도구</span>
            {toolsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )}
          </div>

          {toolsOpen && (
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              <Link
                href={`/wiki/${username}/${slug}/edit`}
                className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                편집
              </Link>
              <Link
                href={`/wiki/${username}/${slug}/history`}
                className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <History className="w-3 h-3" />
                역사
              </Link>
              <Link
                href={`/wiki/${username}/${slug}/link`}
                className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <Link2 className="w-3 h-3" />
                링크 추가
              </Link>
              <Link
                href={`/wiki/${username}/${slug}/move`}
                className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <MoveRight className="w-3 h-3" />
                이동
              </Link>
              <button
                className="flex items-center gap-1.5 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50 text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                삭제
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───── Add section button (owner only) ───── */}
      {isOwner && onAddSection && (
        <div className="px-3 py-3 mt-auto">
          <button
            onClick={onAddSection}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-green-600 text-green-700 px-2 py-1.5 rounded hover:bg-green-50 transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            새 섹션 추가
          </button>
        </div>
      )}
    </aside>
  );
}
