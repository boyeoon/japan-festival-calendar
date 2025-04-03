"use client";

import { useEffect, useState } from "react";
import Info from "@/components/calendar/info";
import InfoModal from "@/components/modal/infomodal";

export default function DateModal({
  isOpen,
  onClose,
  date,
  events,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  events: {
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
  }[];
  lang: string;
}) {
  const [openInfoId, setOpenInfoId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const toggleInfo = (id: number) => {
    setOpenInfoId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white p-3 sm:p-6 rounded-md sm:rounded-lg w-full sm:w-[400px] max-w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <h2 className="text-base sm:text-xl font-bold">{date}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <img
              src="/Close-Md-Icon.svg"
              alt="Close"
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
          </button>
        </div>

        {/* 이벤트 목록 */}
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={`${event.source}-${event.id}`}
                className="relative group"
              >
                {/* 이벤트 제목 */}
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-sm sm:text-lg text-center px-3 sm:px-4 py-2 rounded-md transition ${
                    event.source === "yoyogi"
                      ? "bg-[#A2D4FF] hover:bg-[#70b9ff]"
                      : event.source === "bread"
                      ? "bg-[#FFD6A5] hover:bg-[#ffbe70]"
                      : "bg-gray-300"
                  }`}
                >
                  {lang === "ko"
                    ? event.title_ko
                    : lang === "ja"
                    ? event.title_ja
                    : event.title_en}
                </a>

                <button
                  onClick={() => {
                    if (isMobile) {
                      toggleInfo(event.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setOpenInfoId(event.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setOpenInfoId(null);
                    }
                  }}
                  className="absolute top-1 right-1 sm:top-1 sm:right-1 text-gray-700 text-xs sm:text-sm hover:text-black"
                >
                  <img
                    src="/Info-Square-Icon.svg"
                    alt="Info"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>

                {openInfoId === event.id && (
                  <InfoModal event={event} lang={lang} labels={Info[lang]} />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              {lang === "ko"
                ? "이벤트가 없습니다."
                : lang === "ja"
                ? "フェスティバルがありません。"
                : "No festivals available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
