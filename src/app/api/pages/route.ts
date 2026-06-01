import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pages = await prisma.wikiPage.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(pages);
  } catch (e) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, slug, description } = await req.json();
    if (!title || !slug) {
      return NextResponse.json({ error: "제목과 슬러그는 필수입니다." }, { status: 400 });
    }

    const existingSlug = await prisma.wikiPage.findFirst({
      where: { slug, userId: session.user.id },
    });
    if (existingSlug) {
      return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 400 });
    }

    const page = await prisma.wikiPage.create({
      data: {
        title,
        slug,
        description: description || null,
        userId: session.user.id,
        infobox: {
          create: {
            title: title,
            fields: "[]",
          },
        },
      },
      include: {
        infobox: true,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
