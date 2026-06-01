import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import WikiPageClient from "@/components/WikiPageClient";

export default async function WikiPageRoute({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  const session = await auth();

  const owner = await prisma.user.findUnique({ where: { username }, select: { id: true, name: true, username: true } });
  if (!owner) notFound();

  const page = await prisma.wikiPage.findUnique({
    where: { userId_slug: { userId: owner.id, slug } },
    include: {
      sections: { orderBy: { order: "asc" } },
      infobox: true,
      attachments: true,
      versions: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, createdAt: true, summary: true, editedBy: true } },
    },
  });
  if (!page) notFound();

  const isOwner = session?.user?.id === owner.id;
  const infoboxFields = page.infobox?.fields ? JSON.parse(page.infobox.fields) : [];
  const versions = page.versions.map(v => ({ ...v, createdAt: v.createdAt.toISOString() }));

  return (
    <WikiPageClient
      wikiTitle={`${owner.name}의 도파민 나무위키`}
      username={username}
      isOwner={isOwner}
      page={{
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        sections: page.sections.map(s => ({ ...s, createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString() })),
        infobox: page.infobox ? { ...page.infobox, fields: infoboxFields } : null,
        attachments: page.attachments.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
        versions,
        updatedAt: page.updatedAt.toISOString(),
      }}
    />
  );
}
