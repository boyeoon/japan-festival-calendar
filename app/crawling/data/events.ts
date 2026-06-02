import yoyogi from "@/crawling/data/crawlYoyogi.json";
import bread from "@/crawling/data/crawlBread.json";
import tokyo from "@/crawling/data/crawlTokyo.json";

export const allEvents = [
  ...yoyogi.map((event) => ({ ...event, source: "yoyogi" })),
  ...bread.map((event) => ({ ...event, source: "bread" })),
  ...tokyo.map((event) => ({ ...event, source: "tokyo" })),
];
