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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState<Event[]>([]);

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

  useEffect(() => {
    fetchEvents();
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

          return (
            <div
              key={day}
              className={`p-6 h-32 flex flex-col items-center justify-start border rounded-md ${
                dayOfWeek === 0
                  ? "text-red-500"
                  : dayOfWeek === 6
                  ? "text-blue-500"
                  : ""
              }`}
            >
              <span className="font-semibold">{day}</span>
              <div className="mt-1 w-full flex flex-col items-center">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-blue-200 text-xs text-center px-2 py-1 rounded-md w-full overflow-hidden whitespace-nowrap overflow-ellipsis"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
