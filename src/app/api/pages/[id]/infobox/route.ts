import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const page = await prisma.wikiPage.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
    if (page.userId !== session.user.id) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    const { title, subtitle, image, fields } = await req.json();
    const infobox = await prisma.wikiInfobox.upsert({
      where: { pageId: id },
      update: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(image !== undefined && { image }),
        ...(fields !== undefined && { fields: JSON.stringify(fields) }),
      },
      create: {
        pageId: id,
        title: title || page.title,
        subtitle: subtitle || null,
        image: image || null,
        fields: fields ? JSON.stringify(fields) : "[]",
      },
    });
    return NextResponse.json({ ...infobox, fields: JSON.parse(infobox.fields) });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
