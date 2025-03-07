"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja"; // 일본어 날짜 지원

dayjs.locale("ja");

interface Event {
  id: number;
  title: string;
  date: string;
}

interface Holiday {
  date: string;
  localName: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState<Event[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // 이벤트
  async function fetchEvents() {
    try {
      const response = await fetch(
        `/api/events?year=${currentDate.year()}&month=${
          currentDate.month() + 1
        }`
      );
      if (!response.ok) {
        throw new Error("이벤트 데이터를 불러오는 데 실패했습니다.");
      }
      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  }

  // 공휴일
  async function fetchHolidays() {
    try {
      const response = await fetch(`/api/holidays?year=${currentDate.year()}`);
      if (!response.ok) {
        throw new Error(
          `공휴일 데이터를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`
        );
      }
      const data: Holiday[] = await response.json();
      console.log("공휴일 데이터:", data);
      setHolidays(data);
    } catch (error) {
      console.error("공휴일 데이터 가져오기 실패:", error);
    }
  }

  useEffect(() => {
    fetchEvents();
    fetchHolidays();
  }, [currentDate]);

  function prevMonth() {
    setCurrentDate(currentDate.subtract(1, "month"));
  }

  function nextMonth() {
    setCurrentDate(currentDate.add(1, "month"));
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 p-4">
      {/* 달력 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 bg-gray-200 rounded-md">
          ◀
        </button>
        <h2 className="text-2xl font-semibold">
          {currentDate.format("YYYY년 MM월")}
        </h2>
        <button onClick={nextMonth} className="p-2 bg-gray-200 rounded-md">
          ▶
        </button>
      </div>

      {/* 달력 테이블 */}
      <div className="grid grid-cols-7 gap-1 border border-gray-300 p-2 rounded-md">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold p-2 bg-gray-100 ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
            }`}
          >
            {day}
          </div>
        ))}

        {/* 빈 칸 채우기 (달의 시작 요일 고려) */}
        {[...Array(currentDate.startOf("month").day())].map((_, i) => (
          <div key={`empty-${i}`} className="p-6"></div>
        ))}

        {/* 날짜 출력 */}
        {[...Array(currentDate.daysInMonth())].map((_, i) => {
          const day = i + 1;
          const date = currentDate.date(day);
          const dayOfWeek = date.day(); // 0 = 일요일, 6 = 토요일

          const dayEvents = events.filter((e) => dayjs(e.date).date() === day);
          const holiday = holidays.find((h) =>
            dayjs(h.date).isSame(date, "day")
          );

          return (
            <div
              key={day}
              className={`p-6 h-32 flex flex-col items-center justify-start border rounded-md`}
            >
              {/* 날짜 표시 - 공휴일이면 빨간색, 그렇지 않으면 기본 요일 색상 유지 */}
              <span
                className={`font-semibold ${
                  holiday || dayOfWeek === 0
                    ? "text-red-500"
                    : dayOfWeek === 6
                    ? "text-blue-500"
                    : "text-black"
                }`}
              >
                {day}
              </span>

              {/* 공휴일 표시 */}
              {holiday && (
                <div className="mt-1 bg-red-300 text-xs px-2 py-1 rounded-md w-full text-center">
                  {holiday.localName}
                </div>
              )}

              {/* 이벤트 표시 */}
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-blue-200 text-xs text-center px-2 py-1 rounded-md w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
