import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `uploads/${session.user.id}/${crypto.randomUUID()}.${ext}`;

  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
