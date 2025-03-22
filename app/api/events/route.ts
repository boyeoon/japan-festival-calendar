// Next.js API에서 이벤트 불러오기
import { NextResponse } from "next/server";
import { allEvents } from "@/crawling/data/events";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    if (!year || !month) {
      return NextResponse.json(
        { message: "년도와 월을 입력해주세요." },
        { status: 400 }
      );
    }

    const filtered = allEvents.filter((event) => {
      const date = new Date(event.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("이벤트 데이터 로드 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
