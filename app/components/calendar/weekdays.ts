const weekdays: Record<string, string[]> = {
  ja: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  ko: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  en: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
} as const;

export default weekdays;
