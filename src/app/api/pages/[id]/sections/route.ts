import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
    const { title, content, order, level } = await req.json();
    if (!title) return NextResponse.json({ error: "섹션 제목은 필수입니다." }, { status: 400 });
    const section = await prisma.wikiSection.create({
      data: { title, content: content || "", order: order ?? 0, level: level ?? 1, pageId: id },
    });
    return NextResponse.json(section, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
