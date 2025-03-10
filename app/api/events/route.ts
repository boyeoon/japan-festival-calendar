// Next.js API에서 이벤트 불러오기
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { message: "Year and month are required" },
        { status: 400 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`
          ),
        },
      },
      select: {
        id: true,
        date: true,
        link: true,
        title_ja: true,
        title_ko: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("이벤트 데이터 가져오기 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
