"use client";

import { useEffect, useRef, useState } from "react";

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
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      setPosition(e.clientY > windowHeight / 2 ? "top" : "bottom");
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <div
      ref={infoRef}
      className={`absolute ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      } left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-gray-300 shadow-lg rounded-md z-50
        w-[90vw] max-w-[30rem] p-3 sm:p-4 text-sm sm:text-base whitespace-pre-wrap`}
    >
      <div className="flex mb-1">
        <span className="w-10 sm:w-14 font-bold shrink-0">{labels[0]}:</span>
        <span>
          {lang === "ko"
            ? event.location_ko
            : lang === "ja"
            ? event.location_ja
            : event.location_en}
        </span>
      </div>
      <div className="flex mb-1">
        <span className="w-10 sm:w-14 font-bold shrink-0">{labels[1]}:</span>
        <span>
          {event.date} {event.time}
        </span>
      </div>
      <div className="flex">
        <span className="w-10 sm:w-14 font-bold shrink-0">{labels[2]}:</span>
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
