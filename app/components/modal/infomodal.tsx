interface InfoModalProps {
  event: {
    location_ja: string;
    location_ko: string;
    location_en: string;
    date: string;
    time: string;
    description_ja: string;
    description_ko: string;
    description_en: string;
  };
  lang: string;
  labels: string[]; // Info[lang]
}

export default function InfoModal({ event, lang, labels }: InfoModalProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white border border-gray-300 shadow-lg p-4 rounded-md z-50 w-[30rem] text-md whitespace-pre-wrap">
      <div className="flex mb-1">
        <span className="w-14 font-bold shrink-0">{labels[0]}:</span>
        <span>
          {lang === "ko"
            ? event.location_ko
            : lang === "ja"
            ? event.location_ja
            : event.location_en}
        </span>
      </div>
      <div className="flex mb-1">
        <span className="w-14 font-bold shrink-0">{labels[1]}:</span>
        <span>
          {event.date} {event.time}
        </span>
      </div>
      <div className="flex">
        <span className="w-14 font-bold shrink-0">{labels[2]}:</span>
        <span className="whitespace-pre-wrap">
          {lang === "ko"
            ? event.description_ko
            : lang === "ja"
            ? event.description_ja
            : event.description_en}
        </span>
      </div>
    </div>
  );
}
