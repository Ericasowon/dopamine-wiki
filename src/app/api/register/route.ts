import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, name } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
    }
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return NextResponse.json({ error: "이미 사용 중인 사용자 이름입니다." }, { status: 400 });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, username, name: name || username },
    });
    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
