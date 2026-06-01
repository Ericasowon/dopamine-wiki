"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function NewPageButton({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9가-힣-]/g, "").slice(0, 50);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug: slug || autoSlug(title) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "오류가 발생했습니다."); setLoading(false); return; }
    setOpen(false);
    router.push(`/wiki/${username}/${data.slug}`);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ backgroundColor: "#1a6e3c" }} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
        <Plus className="w-4 h-4" /> 새 문서 만들기
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg mb-4">새 문서 만들기</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문서 제목</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (!slug) setSlug(autoSlug(e.target.value)); }} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="예: 민준" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL 슬러그</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="예: minjun" />
                <p className="text-xs text-gray-400 mt-1">접속 주소: /wiki/{username}/{slug || "..."}</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">취소</button>
                <button type="submit" disabled={loading} style={{ backgroundColor: "#1a6e3c" }} className="flex-1 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {loading ? "만드는 중..." : "만들기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
