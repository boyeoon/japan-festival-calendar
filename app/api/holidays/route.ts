import { NextResponse } from "next/server";

const JAPAN_HOLIDAYS_API = "https://date.nager.at/api/v3/PublicHolidays";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    if (!year) {
      console.error("year 값이 없음");
      return NextResponse.json(
        { message: "Year is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching holidays for year: ${year}`);
    const response = await fetch(`${JAPAN_HOLIDAYS_API}/${year}/JP`);

    if (!response.ok) {
      console.error(`API 응답 오류: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { message: "Failed to fetch holiday data" },
        { status: response.status }
      );
    }

    const holidays = await response.json();
    console.log("공휴일 데이터 가져오기 성공:", holidays);

    return NextResponse.json(holidays);
  } catch (error) {
    console.error("서버 오류:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
