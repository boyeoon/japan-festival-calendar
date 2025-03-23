import Info from "@/components/calendar/info";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()} // 바깥 클릭 시 모달 닫기
    >
      <div
        className="bg-white p-6 rounded-lg w-[400px] max-w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-xl font-bold">{date}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
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
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-lg text-center px-4 py-2 rounded-md transition
            ${
              lang === "ko"
                ? "font-LINESeedKR"
                : lang === "en"
                ? "font-LINESeedJP"
                : "font-LINESeedEN"
            } ${
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

                {/* 말풍선 (툴팁) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white border border-gray-300 shadow-lg p-4 rounded-md z-50 w-[30rem] text-md whitespace-pre-wrap">
                  <div className="flex mb-1">
                    <span className="w-14 font-bold shrink-0">
                      {Info[lang][0]}:
                    </span>
                    <span>
                      {lang === "ko"
                        ? event.location_ko
                        : lang === "ja"
                        ? event.location_ja
                        : event.location_en}
                    </span>
                  </div>
                  <div className="flex mb-1">
                    <span className="w-14 font-bold shrink-0">
                      {Info[lang][1]}:
                    </span>
                    <span>
                      {event.date} {event.time}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-14 font-bold shrink-0">
                      {Info[lang][2]}:
                    </span>
                    <span className="whitespace-pre-wrap">
                      {lang === "ko"
                        ? event.description_ko
                        : lang === "ja"
                        ? event.description_ja
                        : event.description_en}
                    </span>
                  </div>
                </div>
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
