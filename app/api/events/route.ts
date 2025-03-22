// Next.js API에서 이벤트 불러오기
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface Event {
  id: number;
  title_ja: string;
  title_ko: string;
  title_en: string;
  date: string;
  link: string;
  source: string;
}

const sources = [
  { filename: "crawling/data/crawlYoyogi.json", source: "yoyogi" },
  { filename: "crawling/data/crawlBread.json", source: "bread" },
];

export async function GET(req: Request) {
  // 요청된 URL에서 검색 파라미터 추출
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

    const readPromises = sources.map(async ({ filename, source }) => {
      const filePath = path.join(process.cwd(), "app", filename);
      try {
        // JSON 데이터 불러오기
        const data = await fs.readFile(filePath, "utf-8");
        const json = JSON.parse(data);
        return json.map((event: Omit<Event, "source">) => ({
          ...event,
          source,
        }));
      } catch {
        // 파일이 없거나 파싱 실패 시 빈 배열 반환
        return [];
      }
    });
    const allEvents = (await Promise.all(readPromises)).flat();

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
