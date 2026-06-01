import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, sectionId } = await params;
  try {
    const page = await prisma.wikiPage.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
    if (page.userId !== session.user.id) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    const section = await prisma.wikiSection.findUnique({ where: { id: sectionId } });
    if (!section || section.pageId !== id) return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 404 });
    const { title, content } = await req.json();
    const updated = await prisma.wikiSection.update({
      where: { id: sectionId },
      data: { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, sectionId } = await params;
  try {
    const page = await prisma.wikiPage.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
    if (page.userId !== session.user.id) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    const section = await prisma.wikiSection.findUnique({ where: { id: sectionId } });
    if (!section || section.pageId !== id) return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 404 });
    await prisma.wikiSection.delete({ where: { id: sectionId } });
    return NextResponse.json({ message: "섹션이 삭제되었습니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
