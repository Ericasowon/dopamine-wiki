import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect(`/wiki/${(session.user as any).username}`);
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header style={{ backgroundColor: "#1a6e3c" }} className="text-white px-6 py-4 flex items-center">
        <span className="text-xl font-bold">🌿 도파민 나무위키</span>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">나만의 나무위키를 만들어보세요</h1>
        <p className="text-lg text-gray-500 mb-10">소중한 사람들, 추억, 취향을 나무위키 스타일로 기록하세요</p>
        <div className="flex justify-center gap-4 mb-16">
          <Link href="/register" style={{ backgroundColor: "#1a6e3c" }} className="text-white px-8 py-3 rounded-lg font-medium hover:opacity-90">시작하기</Link>
          <Link href="/login" className="border-2 px-8 py-3 rounded-lg font-medium hover:bg-gray-50" style={{ borderColor: "#1a6e3c", color: "#1a6e3c" }}>로그인</Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: "📝", title: "자유로운 편집", desc: "섹션별로 자유롭게 텍스트를 편집하세요" },
            { icon: "🖼", title: "사진 첨부", desc: "사진과 이미지를 쉽게 첨부하세요" },
            { icon: "📚", title: "목차 자동 생성", desc: "섹션이 목차로 자동 정리됩니다" },
          ].map(f => (
            <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
