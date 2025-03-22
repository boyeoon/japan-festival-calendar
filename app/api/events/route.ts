// Next.js API에서 이벤트 불러오기
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    // 요청된 URL에서 검색 파라미터 추출
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    if (!year || !month) {
      return NextResponse.json(
        { message: "년도와 월을 입력해주세요." },
        { status: 400 }
      );
    }

    const sources = [
      { filename: "crawling/data/crawlYoyogi.json", source: "yoyogi" },
      { filename: "crawling/data/crawlBread.json", source: "bread" },
    ];

    let events: any[] = [];

    for (const { filename, source } of sources) {
      const filePath = path.join(process.cwd(), "app", filename);
      if (fs.existsSync(filePath)) {
        // JSON 데이터 불러오기
        const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const withSource = fileData.map((e: any) => ({
          ...e,
          source,
        }));
        events.push(...withSource);
      }
    }

    // 특정 연도와 월에 해당하는 이벤트만 필터링
    const filtered = events.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("이벤트 데이터 로드 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
