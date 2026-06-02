const fs = require("fs");
const path = require("path");

const YEAR = Number(process.env.CRAWL_YEAR) || new Date().getFullYear();
const SOURCE_URL = process.env.BREAD_SOURCE_URL || "https://pannofes.jp/event/";
const OUTPUT_PATH = path.resolve(__dirname, "../data/crawlBread.json");

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "-")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeText(value) {
  return decodeHtml(value)
    .replace(/[⽉]/g, "月")
    .replace(/[⽇]/g, "日")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, " ").trim();
}

function formatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function expandDateRange(dateText) {
  const normalized = compactText(dateText).replace(/\s/g, "");
  const datePattern = /(?:(\d{4})年)?(?:(\d{1,2})月)?(\d{1,2})日/g;
  const matches = [...normalized.matchAll(datePattern)];

  if (matches.length === 0) return [];

  const startMatch = matches[0];
  const endMatch = normalized.includes("〜") || normalized.includes("～") || normalized.includes("~")
    ? matches.at(-1)
    : startMatch;
  const startYear = Number(startMatch[1] || YEAR);
  const startMonth = Number(startMatch[2]);
  const startDay = Number(startMatch[3]);
  const endYear = Number(endMatch[1] || startYear);
  const endMonth = Number(endMatch[2] || startMonth);
  const endDay = Number(endMatch[3]);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const dates = [];

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(formatDate(cursor));
  }

  return dates;
}

function absolutizeUrl(url) {
  return new URL(url, SOURCE_URL).toString();
}

function parseEventList(html) {
  const events = [];
  const itemPattern =
    /<div class="p-event-archive__items__item[\s\S]*?<a href="([^"]+)"[\s\S]*?<img[^>]*alt="([^"]*)"[\s\S]*?<\/div>/g;

  for (const match of html.matchAll(itemPattern)) {
    const link = absolutizeUrl(match[1]);
    const title = compactText(match[2]);

    if (!title.includes(String(YEAR))) continue;

    events.push({ title, link });
  }

  return events;
}

function findDefinitionValue(html, label) {
  const pattern = new RegExp(
    `<dt>\\s*${label}\\s*<\\/dt>\\s*<dd>([\\s\\S]*?)<\\/dd>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? normalizeText(match[1]).replace(/\s*ホームページ\s*$/, "") : "";
}

function parseDescription(html) {
  const headingMatch = html.match(
    /<h3 class="p-event-outline__hd">[\s\S]*?<\/h3>([\s\S]*?)<div class="p-event-outline__info">/
  );

  if (!headingMatch) return "最新情報は公式サイトをご確認ください。";

  const description = normalizeText(headingMatch[1]);
  return description || "最新情報は公式サイトをご確認ください。";
}

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function crawlBreadEvents() {
  const archiveHtml = await fetchText(SOURCE_URL);
  const listedEvents = parseEventList(archiveHtml);
  const events = [];

  for (const listedEvent of listedEvents) {
    const detailHtml = await fetchText(listedEvent.link);
    const title =
      compactText(detailHtml.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || "") ||
      listedEvent.title;
    const dateText = findDefinitionValue(detailHtml, "開催日");
    const dates = expandDateRange(dateText);
    const time = findDefinitionValue(detailHtml, "時間") || "詳細は公式サイトをご確認ください";
    const location = findDefinitionValue(detailHtml, "会場") || "会場は公式サイトをご確認ください";
    const description = parseDescription(detailHtml);

    for (const date of dates) {
      events.push({
        title,
        date,
        link: listedEvent.link,
        location,
        time,
        description,
      });
    }
  }

  const calendarEvents = events
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
    .map((event, index) => ({
      id: index + 1,
      title_ja: event.title,
      title_ko: event.title,
      title_en: event.title,
      date: event.date,
      link: event.link,
      location_ja: event.location,
      location_ko: event.location,
      location_en: event.location,
      time: event.time,
      description_ja: event.description,
      description_ko: "최신 정보는 공식 사이트를 확인해 주세요.",
      description_en: "Please check the official site for the latest information.",
      source: "bread",
    }));

  if (calendarEvents.length === 0) {
    throw new Error("No bread festival events found. The source markup may have changed.");
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(calendarEvents, null, 2)}\n`);
  console.log(`Saved ${calendarEvents.length} bread events to ${OUTPUT_PATH}`);
  console.log(
    `Date range: ${calendarEvents[0].date} - ${calendarEvents.at(-1).date}`
  );
}

crawlBreadEvents().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
