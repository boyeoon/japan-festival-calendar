import { useState, useEffect } from "react";

export default function LanguageButton({
  onChange,
}: {
  onChange: (lang: string) => void;
}) {
  const [lang, setLang] = useState<string>(() => {
    return localStorage.getItem("language") || "ja";
  });

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  const handleChange = (newLang: string) => {
    setLang(newLang);
    onChange(newLang);
  };

  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-2 rounded-md ${
          lang === "ja" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleChange("ja")}
      >
        日本語
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          lang === "ko" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleChange("ko")}
      >
        한국어
      </button>
    </div>
  );
}
