export default function Modal({
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
  }[];
  lang: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // 바깥 클릭 시 모달 닫기
    >
      <div
        className="bg-white p-6 rounded-lg w-[400px] max-w-full shadow-lg"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록 방지
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
                className={`block bg-[#A2D4FF] text-lg text-center px-4 py-2 rounded-md hover:bg-[#70b9ff] transition ${
                  lang === "ko"
                    ? "font-LINESeedKR"
                    : lang === "en"
                    ? "font-LINESeedJP"
                    : "font-LINESeedEN"
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
