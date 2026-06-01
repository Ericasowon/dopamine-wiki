"use client";
import { useState } from "react";
import WikiHeader from "@/components/WikiHeader";
import TableOfContents from "@/components/TableOfContents";
import WikiSection from "@/components/WikiSection";
import WikiInfobox from "@/components/WikiInfobox";
import InfoboxEditor from "@/components/InfoboxEditor";

interface PageSection {
  id: string;
  title: string;
  content: string;
  order: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

interface PageInfobox {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  fields: { key: string; value: string }[];
}

interface WikiPageClientProps {
  wikiTitle: string;
  username: string;
  isOwner: boolean;
  page: {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    sections: PageSection[];
    infobox: PageInfobox | null;
    attachments: { id: string; filename: string; url: string; mimeType: string; caption?: string | null; createdAt: string }[];
    versions: { id: string; createdAt: string; summary?: string | null }[];
    updatedAt: string;
  };
}

export default function WikiPageClient({ wikiTitle, username, isOwner, page }: WikiPageClientProps) {
  const [sections, setSections] = useState(page.sections);
  const [infobox, setInfobox] = useState(page.infobox);
  const [showInfoboxEditor, setShowInfoboxEditor] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionLevel, setNewSectionLevel] = useState(1);
  const [addingSection, setAddingSection] = useState(false);

  function handleSectionUpdated(id: string, title: string, content: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title, content } : s));
  }

  function handleSectionDeleted(id: string) {
    setSections(prev => prev.filter(s => s.id !== id));
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    setAddingSection(true);
    const order = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1;
    const res = await fetch(`/api/pages/${page.id}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSectionTitle, content: "", order, level: newSectionLevel }),
    });
    const data = await res.json();
    if (res.ok) {
      setSections(prev => [...prev, { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      setNewSectionTitle("");
      setShowAddSection(false);
    }
    setAddingSection(false);
  }

  const versions = page.versions.map(v => ({ ...v, createdAt: v.createdAt }));

  return (
    <div className="min-h-screen bg-gray-100">
      <WikiHeader wikiTitle={wikiTitle} username={username} isOwner={isOwner} />
      <div className="flex max-w-7xl mx-auto">
        {/* Left sidebar */}
        <aside className="w-52 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200">
          <TableOfContents
            sections={sections}
            pageId={page.id}
            isOwner={isOwner}
            onAddSection={() => setShowAddSection(true)}
            slug={page.slug}
            username={username}
            versions={versions}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-white border-r border-gray-200">
          <div className="px-8 py-6">
            {/* Page header */}
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            </div>
            {page.description && (
              <p className="text-gray-500 text-sm mb-1">{page.description}</p>
            )}
            <p className="text-xs text-gray-400 mb-4 border-b border-gray-200 pb-3">
              최근 수정: {new Date(page.updatedAt).toLocaleString("ko-KR")}
            </p>

            {/* Sections */}
            {sections.length === 0 && isOwner ? (
              <div className="text-center py-12 text-gray-400">
                <p className="mb-3">아직 섹션이 없어요.</p>
                <button
                  onClick={() => setShowAddSection(true)}
                  style={{ color: "#1a6e3c" }}
                  className="text-sm border border-current px-4 py-1.5 rounded hover:bg-green-50"
                >
                  첫 섹션 추가하기
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map(section => (
                  <WikiSection
                    key={section.id}
                    {...section}
                    pageId={page.id}
                    isOwner={isOwner}
                    onUpdated={handleSectionUpdated}
                    onDeleted={handleSectionDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar - infobox */}
        <aside className="w-64 shrink-0 p-4">
          {infobox ? (
            <WikiInfobox
              title={infobox.title}
              subtitle={infobox.subtitle}
              image={infobox.image}
              fields={infobox.fields}
              isOwner={isOwner}
              onEdit={() => setShowInfoboxEditor(true)}
            />
          ) : isOwner ? (
            <button
              onClick={() => setShowInfoboxEditor(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 hover:border-green-400 hover:text-green-600 text-sm"
            >
              + 인포박스 추가
            </button>
          ) : null}
        </aside>
      </div>

      {/* Add section modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg mb-4">새 섹션 추가</h2>
            <form onSubmit={handleAddSection} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">섹션 제목</label>
                <input
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="예: 개요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">헤딩 레벨</label>
                <select
                  value={newSectionLevel}
                  onChange={e => setNewSectionLevel(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value={1}>1단계 (H2)</option>
                  <option value={2}>2단계 (H3)</option>
                  <option value={3}>3단계 (H4)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSection(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={addingSection}
                  style={{ backgroundColor: "#1a6e3c" }}
                  className="flex-1 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {addingSection ? "추가 중..." : "추가"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Infobox editor */}
      {showInfoboxEditor && (
        <InfoboxEditor
          pageId={page.id}
          infobox={infobox || { title: page.title, subtitle: page.description || "", image: null, fields: [] }}
          onSaved={(updated) => { setInfobox(updated as PageInfobox); setShowInfoboxEditor(false); }}
          onClose={() => setShowInfoboxEditor(false)}
        />
      )}
    </div>
  );
}
