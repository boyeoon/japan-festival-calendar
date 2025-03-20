"use client";

import { useState, useEffect } from "react";

export default function LanguageButton({
  onChange,
}: {
  onChange: (lang: string) => void;
}) {
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "ja";
    }
    return "ja";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      onChange(lang);
    }
  }, [lang, onChange]);

  const handleChange = (newLang: string) => {
    if (lang !== newLang) setLang(newLang);
  };

  return (
    <div className="flex gap-2">
      {[
        { code: "ja", label: "日本語", font: "font-LINESeedJP" },
        { code: "ko", label: "한국어", font: "font-LINESeedKR" },
        { code: "en", label: "English", font: "font-LINESeedJP" },
      ].map(({ code, label, font }) => (
        <button
          key={code}
          className={`px-4 py-2 rounded-md ${
            lang === code ? "bg-blue-500 text-white" : "bg-gray-200"
          } ${font}`}
          onClick={() => handleChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
