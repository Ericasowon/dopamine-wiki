"use client";
import { useState } from "react";
import WikiEditor from "@/components/WikiEditor";

interface WikiSectionProps {
  id: string;
  title: string;
  content: string;
  order: number;
  level: number;
  pageId: string;
  isOwner: boolean;
  onUpdated: (id: string, title: string, content: string) => void;
  onDeleted: (id: string) => void;
}

export default function WikiSection({
  id,
  title,
  content,
  order,
  level,
  pageId,
  isOwner,
  onUpdated,
  onDeleted,
}: WikiSectionProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}/sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      onUpdated(id, editTitle, editContent);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("이 섹션을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/pages/${pageId}/sections/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      onDeleted(id);
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const HeadingTag = level === 3 ? "h3" : "h2";
  const headingClass =
    level === 3
      ? "text-xl font-semibold mt-6 mb-2"
      : "text-2xl font-bold mt-8 mb-3 border-b pb-1";

  if (editing) {
    return (
      <div className="my-6 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">섹션 제목</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <WikiEditor
            content={editContent}
            onChange={setEditContent}
            placeholder="섹션 내용을 입력하세요..."
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-1.5 bg-white border border-gray-300 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="ml-auto px-4 py-1.5 bg-red-50 border border-red-300 text-red-600 text-sm rounded hover:bg-red-100 disabled:opacity-50"
          >
            섹션 삭제
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 group relative">
      <div className="flex items-start justify-between gap-2">
        <HeadingTag id={`section-${order}`} className={headingClass}>
          {title}
        </HeadingTag>
        {isOwner && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-1 shrink-0 text-xs text-gray-400 hover:text-blue-600 px-2 py-0.5 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            [편집]
          </button>
        )}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
