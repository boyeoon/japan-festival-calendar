"use client";

import { useState, useEffect } from "react";
import languages from "@/components/button/languages";

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
      {Object.entries(languages).map(([code, label]) => (
        <button
          key={code}
          className={`text-xs sm:text-sm px-4 py-2 rounded-md ${
            lang === code ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
