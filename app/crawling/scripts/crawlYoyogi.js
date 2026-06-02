const fs = require("fs");
const path = require("path");

const YEAR = Number(process.env.CRAWL_YEAR) || new Date().getFullYear();
const SOURCE_URL =
  process.env.YOYOGI_SOURCE_URL ||
  `https://www.yoyogikoen.info/${YEAR}-archive-2/`;
const OUTPUT_PATH = path.resolve(__dirname, "../data/crawlYoyogi.json");

const LOCATION_JA = "代々木公園イベント広場";
const LOCATION_KO = "요요기 공원 이벤트 광장";
const LOCATION_EN = "Yoyogi Park Event Plaza";

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function formatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function expandDateRange(dateText, headingMonth) {
  const normalized = stripTags(dateText).replace(/\s/g, "");
  const matches = [...normalized.matchAll(/(\d{1,2})月(\d{1,2})日/g)];

  if (matches.length === 0) return [];

  const startMatch = normalized.startsWith("開催中") ? matches.at(-1) : matches[0];
  const endMatch = matches.length > 1 ? matches.at(-1) : startMatch;

  const startMonth = normalized.startsWith("開催中")
    ? headingMonth
    : Number(startMatch[1]);
  const startDay = normalized.startsWith("開催中") ? 1 : Number(startMatch[2]);
  const endMonth = Number(endMatch[1]);
  const endDay = Number(endMatch[2]);

  const start = new Date(YEAR, startMonth - 1, startDay);
  const end = new Date(YEAR, endMonth - 1, endDay);
  const dates = [];

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(formatDate(cursor));
  }

  return dates;
}

function getAttribute(html, attribute) {
  const match = html.match(new RegExp(`${attribute}="([^"]+)"`));
  return match ? decodeHtml(match[1]) : "";
}

function parseSchedule(html) {
  const events = [];
  const seen = new Set();
  const monthPattern =
    /<div class="ftn-es-month">([\s\S]*?<ul class="ftn-es-list">[\s\S]*?<\/ul>)\s*<\/div>/g;

  for (const monthMatch of html.matchAll(monthPattern)) {
    const monthHtml = monthMatch[1];
    const headingMatch = monthHtml.match(/<h3 class="ftn-es-month-heading">([\s\S]*?)<\/h3>/);
    const heading = headingMatch ? stripTags(headingMatch[1]) : "";
    const headingMonth = Number(heading.match(/(\d{1,2})月/)?.[1]);

    if (!headingMonth) continue;

    const itemPattern = /<li class="ftn-es-item">([\s\S]*?)<\/li>/g;
    for (const itemMatch of monthHtml.matchAll(itemPattern)) {
      const itemHtml = itemMatch[1];
      const dateMatch = itemHtml.match(/<span class="ftn-es-date">([\s\S]*?)<\/span>/);
      const nameMatch = itemHtml.match(/<a class="ftn-es-name"([^>]*)>([\s\S]*?)<\/a>/);

      if (!dateMatch || !nameMatch) continue;

      const dates = expandDateRange(dateMatch[1], headingMonth);
      const title = stripTags(nameMatch[2]);
      const link = getAttribute(nameMatch[1], "href");

      for (const date of dates) {
        const key = `${date}|${title}|${link}`;
        if (seen.has(key)) continue;
        seen.add(key);

        events.push({
          title,
          date,
          link,
        });
      }
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function toCalendarEvent(event, index) {
  return {
    id: index + 1,
    title_ja: event.title,
    title_ko: event.title,
    title_en: event.title,
    date: event.date,
    link: event.link,
    location_ja: LOCATION_JA,
    location_ko: LOCATION_KO,
    location_en: LOCATION_EN,
    time: "詳細は公式サイトをご確認ください",
    description_ja: "最新情報は公式サイトをご確認ください。",
    description_ko: "최신 정보는 공식 사이트를 확인해 주세요.",
    description_en: "Please check the official site for the latest information.",
    source: "yoyogi",
  };
}

async function crawlYoyogiEvents() {
  const response = await fetch(SOURCE_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
  }

  const html = await response.text();
  const events = parseSchedule(html).map(toCalendarEvent);

  if (events.length === 0) {
    throw new Error("No Yoyogi events found. The source markup may have changed.");
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(events, null, 2)}\n`);
  console.log(`Saved ${events.length} Yoyogi events to ${OUTPUT_PATH}`);
  console.log(`Date range: ${events[0].date} - ${events.at(-1).date}`);
}

crawlYoyogiEvents().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
