// 크롤링한 데이터를 DB에 저장하는 API
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const filePath = path.resolve(process.cwd(), "app/events.json");

    // events.json 파일 확인
    if (!fs.existsSync(filePath)) {
      console.error("events.json 파일을 찾을 수 없습니다.");
      return NextResponse.json(
        { message: "events.json 파일이 없습니다." },
        { status: 404 }
      );
    }

    // JSON 데이터 읽기
    let events;
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      events = JSON.parse(rawData);
    } catch (jsonError) {
      console.error("JSON 파싱 실패:", jsonError);
      return NextResponse.json({ message: "JSON 파싱 오류" }, { status: 400 });
    }

    if (!Array.isArray(events) || events.length === 0) {
      console.error("events.json 파일이 비어 있습니다.");
      return NextResponse.json(
        { message: "이벤트 데이터가 없습니다." },
        { status: 400 }
      );
    }

    for (const event of events) {
      // 필수 필드 검증
      if (!event.title_ja || !event.title_ko || !event.date || !event.link) {
        console.error(`잘못된 데이터: ${JSON.stringify(event, null, 2)}`);
        continue;
      }

      let eventDate;
      try {
        eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime()))
          throw new Error("유효하지 않은 날짜 형식");
      } catch (dateError) {
        console.error(`날짜 변환 실패: ${event.date}`, dateError);
        continue;
      }

      try {
        // 중복 체크
        const exists = await prisma.event.findFirst({
          where: { title_ja: event.title_ja, date: eventDate },
        });

        if (!exists) {
          // 데이터 저장
          const savedEvent = await prisma.event.create({
            data: {
              title_ja: String(event.title_ja),
              title_ko: String(event.title_ko),
              date: eventDate,
              link: String(event.link),
              source: "요요기 공원", // 하드코딩인데 나중에 방법 찾아보기
            },
          });

          console.log("이벤트 저장 완료:", savedEvent);
        }
      } catch (dbError) {
        console.error("DB 저장 실패:", JSON.stringify(dbError, null, 2));
        continue;
      }
    }

    return NextResponse.json({ message: "이벤트 데이터 저장 완료" });
  } catch (error) {
    console.error("서버 오류 발생:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
