"use client";

import sources from "@/components/filter/sources";

export default function SourceFilter({
  lang,
  selected,
  onChange,
}: {
  lang: string;
  selected: string[];
  onChange: (newSources: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex gap-2 mb-4 text-sm sm:text-base overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1 -mx-1">
      {sources.map((source) => {
        const isSelected = selected.includes(source.source);
        return (
          <button
            key={source.source}
            onClick={() => toggle(source.source)}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all 
              ${
                isSelected
                  ? `${source.color}`
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
          >
            {lang === "ko"
              ? source.label_ko
              : lang === "ja"
              ? source.label_ja
              : source.label_en}
          </button>
        );
      })}
    </div>
  );
}
