// 크롤링한 데이터를 DB에 저장하는 API
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const rawData = fs.readFileSync("events.json", "utf-8");
    const events = JSON.parse(rawData);

    for (const event of events) {
      const exists = await prisma.event.findFirst({
        where: { title: event.title, date: new Date(event.date) },
      });

      if (!exists) {
        await prisma.event.create({
          data: {
            title: event.title,
            date: new Date(event.date),
            link: event.link, // 링크 추가
            source: "요요기 공원",
          },
        });
      }
    }

    return NextResponse.json({ message: "이벤트 데이터 저장 완료" });
  } catch (error) {
    console.error("이벤트 데이터 저장 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
