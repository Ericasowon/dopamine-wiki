import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const page = await prisma.wikiPage.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: "asc" } },
        infobox: true,
        attachments: true,
      },
    });
    if (!page) return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

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
    const { title, description } = await req.json();
    const updated = await prisma.wikiPage.update({
      where: { id },
      data: { ...(title !== undefined && { title }), ...(description !== undefined && { description }) },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
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
    await prisma.wikiPage.delete({ where: { id } });
    return NextResponse.json({ message: "페이지가 삭제되었습니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
