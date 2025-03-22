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
    title_ja: string;
    title_ko: string;
    title_en: string;
    link: string;
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
            events.map((event, index) => (
              <a
                key={index}
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
