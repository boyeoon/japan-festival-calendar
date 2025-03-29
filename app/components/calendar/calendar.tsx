"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import LanguageButton from "@/components/button/languagebutton";
import DateModal from "@/components/modal/datemodal";
import Weekdays from "@/components/calendar/weekdays";

dayjs.locale("ja");

interface Event {
  id: number;
  title_ja: string;
  title_ko: string;
  title_en: string;
  date: string;
  link: string;
  location_ja: string;
  location_ko: string;
  location_en: string;
  time: string;
  description_ja: string;
  description_ko: string;
  description_en: string;
  source: string;
}

interface Holiday {
  date: string;
  localName: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs()); // 달력
  const [events, setEvents] = useState<Event[]>([]); // 이벤트
  const [holidays, setHolidays] = useState<Holiday[]>([]); // 공휴일
  const [lang, setLang] = useState<string>("ja"); //다국어
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 모달
  const [isModalOpen, setIsModalOpen] = useState(false); //모달

  const openModal = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, "month"));
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLang(storedLang);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          `/api/events?year=${currentDate.year()}&month=${
            currentDate.month() + 1
          }`
        );
        if (!response.ok)
          throw new Error("이벤트 데이터를 불러오는 데 실패했습니다.");
        setEvents(await response.json());
      } catch (error) {
        console.error(error);
      }
    }
    fetchEvents();
  }, [currentDate]);

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await fetch(
          `/api/holidays?year=${currentDate.year()}`
        );
        if (!response.ok)
          throw new Error("공휴일 데이터를 불러오는 데 실패했습니다.");
        setHolidays(await response.json());
      } catch (error) {
        console.error("공휴일 데이터 가져오기 실패:", error);
      }
    }
    fetchHolidays();
  }, [currentDate.year()]);

  const getEventTitle = (event: Event) => {
    return lang === "ko"
      ? event.title_ko
      : lang === "ja"
      ? event.title_ja
      : event.title_en;
  };

  const getHolidayForDate = (date: string) => {
    return holidays.find((h) => h.date === date);
  };

  const getEventsForDate = (date: string) => {
    return events.filter((e) => e.date === date);
  };

  const daysInMonth = useMemo(() => currentDate.daysInMonth(), [currentDate]);

  return (
    <div>
      {/* 날짜 선택 모달 */}
      <DateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        date={selectedDate || ""}
        events={getEventsForDate(selectedDate || "")}
        lang={lang}
      />

      <div className="w-full max-w-5xl mx-auto mt-4 px-2 sm:mt-8 sm:p-4">
        {/* 다국어 버튼 */}
        <div className="mb-4 flex justify-end">
          <LanguageButton onChange={setLang} />
        </div>
        {/* 달력 헤더 */}
        <div className="flex justify-between items-center mb-2 sm:mb-4 text-sm sm:text-base">
          <button onClick={prevMonth} className="p-2 bg-gray-200 rounded-md">
            <img
              src="/Arrow-Left-Icon.svg"
              alt="Arrow Left"
              className="w-4 h-4"
            />
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.format("YYYY. MM.")}
          </h2>
          <button onClick={nextMonth} className="p-2 bg-gray-200 rounded-md">
            <img
              src="/Arrow-Right-Icon.svg"
              alt="Arrow Right"
              className="w-4 h-4"
            />
          </button>
        </div>
        {/* 달력 테이블 */}
        <div className="grid grid-cols-7 gap-1 border border-gray-300 p-2 rounded-md">
          {/* 요일 헤더 */}
          {(Weekdays[lang] || Weekdays["en"]).map((day, index) => (
            <div
              key={day}
              className={`text-center font-bold p-1 sm:p-2 text-xs sm:text-sm bg-gray-100 ${
                index === 0
                  ? "text-red-500"
                  : index === 6
                  ? "text-blue-500"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}

          {/* 빈 칸 채우기 (달의 시작 요일 고려) */}
          {[...Array(currentDate.startOf("month").day())].map((_, i) => (
            <div key={`empty-${i}`} className="p-6"></div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = currentDate.date(day).format("YYYY-MM-DD");

            const dayEvents = getEventsForDate(date);
            const displayedEvents = dayEvents.slice(0, 3);
            const totalEventCount = dayEvents.length;

            const holiday = getHolidayForDate(date);
            const isSunday = dayjs(date).day() === 0; // 일요일
            const isSaturday = dayjs(date).day() === 6; // 토요일

            return (
              <div
                key={day}
                className="h-[4.5rem] sm:h-32 flex flex-col border rounded-[0.2rem] sm:rounded-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => openModal(date)}
              >
                {/* 날짜와 공휴일 + 추가 이벤트 개수 표시 */}
                <div className="px-1 py-1.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`text-[0.625rem] sm:text-sm font-semibold ${
                        holiday || isSunday
                          ? "text-red-500"
                          : isSaturday
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    >
                      {day}
                    </span>

                    {/* 공휴일이 있으면 날짜 옆에 표시 */}
                    {holiday && (
                      <span className="ml-1 text-[0.3rem] sm:text-xs text-red-500 font-medium">
                        {holiday.localName}
                      </span>
                    )}
                  </div>

                  {/* 총 이벤트 개수 박스 */}
                  {totalEventCount > 0 && (
                    <span className="bg-gray-300 text-[0.625rem] sm:text-xs text-black px-1 sm:px-2 sm:py-1 rounded-[0.2rem] sm:rounded-md">
                      {totalEventCount}
                    </span>
                  )}
                </div>

                {/* 이벤트 그룹 (최대 3개만 표시) */}
                <div className="flex flex-col gap-[0.15rem] sm:gap-1 w-full">
                  {displayedEvents.map((event) => (
                    <a
                      key={`${event.source}-${event.id}`}
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[0.4rem] sm:text-xs text-center px-1 sm:px-2 py-[0.1rem] sm:py-[0.15rem] w-full overflow-hidden whitespace-nowrap overflow-ellipsis transition rounded-[0.2rem] sm:rounded-md ${
                        event.source === "yoyogi"
                          ? "bg-[#A2D4FF] hover:bg-[#70b9ff]"
                          : event.source === "bread"
                          ? "bg-[#FFD6A5] hover:bg-[#ffbe70]"
                          : "bg-gray-300"
                      }`}
                    >
                      {getEventTitle(event)}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
