"use client";
import { useState, useRef } from "react";
import Image from "next/image";

interface InfoboxField {
  key: string;
  value: string;
}

interface InfoboxEditorProps {
  pageId: string;
  infobox: {
    title: string;
    subtitle?: string | null;
    image?: string | null;
    fields: InfoboxField[];
  };
  onSaved: (updated: {
    title: string;
    subtitle: string;
    image: string;
    fields: InfoboxField[];
  }) => void;
  onClose: () => void;
}

export default function InfoboxEditor({
  pageId,
  infobox,
  onSaved,
  onClose,
}: InfoboxEditorProps) {
  const [title, setTitle] = useState(infobox.title);
  const [subtitle, setSubtitle] = useState(infobox.subtitle ?? "");
  const [image, setImage] = useState(infobox.image ?? "");
  const [fields, setFields] = useState<InfoboxField[]>(
    infobox.fields.length > 0 ? infobox.fields : []
  );
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      }
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFieldChange = (index: number, key: keyof InfoboxField, value: string) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    );
  };

  const addField = () => {
    setFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title, subtitle, image, fields };
      const res = await fetch(`/api/pages/${pageId}/infobox`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      onSaved(payload);
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-w-lg mx-auto mt-20 mb-12 bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">인포박스 편집</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="인포박스 제목"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="부제목 (선택)"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
            {image && (
              <div className="mb-2 relative w-full h-40 rounded overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={image}
                  alt="인포박스 이미지"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              {uploadingImage ? "업로드 중..." : "이미지 변경"}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
                e.target.value = "";
              }}
            />
          </div>

          {/* Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">항목</label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                    placeholder="항목명"
                    className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                    placeholder="값"
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-gray-400 hover:text-red-500 font-bold text-lg leading-none px-1"
                    aria-label="항목 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addField}
              className="mt-2 px-3 py-1 text-sm border border-dashed border-gray-400 rounded text-gray-500 hover:bg-gray-50 hover:border-gray-600"
            >
              + 항목 추가
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadingImage}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
