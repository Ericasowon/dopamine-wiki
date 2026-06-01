import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import WikiHeader from "@/components/WikiHeader";
import NewPageButton from "@/components/NewPageButton";

export default async function WikiHomePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth();
  const owner = await prisma.user.findUnique({ where: { username }, select: { id: true, name: true, username: true } });
  if (!owner) notFound();
  const isOwner = session?.user?.id === owner.id;
  const pages = await prisma.wikiPage.findMany({
    where: { userId: owner.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, description: true, updatedAt: true },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <WikiHeader wikiTitle={`${owner.name}의 도파민 나무위키`} username={username} isOwner={isOwner} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📚 모든 문서</h1>
          {isOwner && <NewPageButton username={username} />}
        </div>
        {pages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-500 mb-2">아직 문서가 없어요.</p>
            {isOwner && <p className="text-gray-400 text-sm">위의 "새 문서 만들기" 버튼을 눌러 첫 문서를 작성해보세요!</p>}
          </div>
        ) : (
          <div className="grid gap-3">
            {pages.map(p => (
              <Link key={p.id} href={`/wiki/${username}/${p.slug}`} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-400 hover:shadow-sm transition-all block">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800">{p.title}</h2>
                    {p.description && <p className="text-sm text-gray-500 mt-0.5">{p.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {new Date(p.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
