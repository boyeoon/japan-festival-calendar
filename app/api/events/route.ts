// Next.js API에서 이벤트 불러오기
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    // 요청된 URL에서 검색 파라미터 추출
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { message: "년도와 월을 입력해주세요." },
        { status: 400 }
      );
    }

    // events.json 파일 경로 설정
    const filePath = path.join(process.cwd(), "app", "events.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "이벤트 데이터 없음" },
        { status: 404 }
      );
    }

    // JSON 데이터 불러오기
    const events = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // 특정 연도와 월에 해당하는 이벤트만 필터링
    const filteredEvents = events.filter((event: { date: string }) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === Number(year) &&
        eventDate.getMonth() + 1 === Number(month) // 월은 0부터 시작하므로 +1
      );
    });

    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error("이벤트 데이터 로드 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
