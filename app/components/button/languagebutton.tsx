import { useState, useEffect } from "react";

export default function LanguageButton({
  onChange,
}: {
  onChange: (lang: string) => void;
}) {
  const [lang, setLang] = useState<string>("ja"); // 기본값을 'ja'로 설정

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      if (storedLang) {
        setLang(storedLang);
      }
    }
  }, []);

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
          lang === "ja"
            ? "bg-blue-500 text-white font-LINESeedJP"
            : "bg-gray-200 font-LINESeedJP"
        }`}
        onClick={() => handleChange("ja")}
      >
        日本語
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          lang === "ko"
            ? "bg-blue-500 text-white font-LINESeedKR"
            : "bg-gray-200 font-LINESeedKR"
        }`}
        onClick={() => handleChange("ko")}
      >
        한국어
      </button>
    </div>
  );
}
