"use client";

import { useState, useEffect } from "react";

export default function LanguageButton({
  onChange,
}: {
  onChange: (lang: string) => void;
}) {
  const [lang, setLang] = useState<string>("ja");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      setLang(storedLang);
      onChange(storedLang);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("language", lang);
      onChange(lang);
    }
  }, [lang, hasMounted, onChange]);

  const handleChange = (newLang: string) => {
    if (lang !== newLang) setLang(newLang);
  };

  if (!hasMounted) return null; // SSR mismatch 방지

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
