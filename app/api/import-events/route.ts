// 크롤링한 데이터를 DB에 저장하는 API
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const filePath = path.resolve(process.cwd(), "app/events.json");

    // events.json 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      console.error("events.json 파일을 찾을 수 없습니다.");
      return NextResponse.json(
        { message: "events.json 파일이 없습니다." },
        { status: 404 }
      );
    }

    // JSON 데이터 읽기
    const rawData = fs.readFileSync(filePath, "utf-8");
    const events = JSON.parse(rawData);

    if (!Array.isArray(events) || events.length === 0) {
      console.error("events.json 파일이 비어 있습니다.");
      return NextResponse.json(
        { message: "이벤트 데이터가 없습니다." },
        { status: 400 }
      );
    }

    for (const event of events) {
      // 필수 필드 검증
      if (!event.title || !event.date || !event.link) {
        console.error(`잘못된 데이터: ${JSON.stringify(event)}`);
        continue;
      }

      const exists = await prisma.event.findFirst({
        where: { title: event.title, date: new Date(event.date) },
      });

      if (!exists) {
        await prisma.event.create({
          data: {
            title: event.title,
            date: new Date(event.date),
            link: event.link,
            source: "요요기 공원",
          },
        });
      }
    }

    return NextResponse.json({ message: "이벤트 데이터 저장 완료" });
  } catch (error) {
    console.error("이벤트 데이터 저장 실패:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
