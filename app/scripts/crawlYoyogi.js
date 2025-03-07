const puppeteer = require("puppeteer");
const fs = require("fs");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

async function scrapeYoyogiEvents() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 요요기 공원 이벤트 페이지로 이동
  await page.goto("https://www.yoyogikoen.info/", {
    waitUntil: "networkidle2",
  });

  // 이벤트 목록이 로드될 때까지 대기
  await page.waitForSelector("li a[title]");

  // 크롤링할 데이터 추출
  const events = await page.evaluate(() => {
    const eventList = [];
    document.querySelectorAll("li").forEach((eventEl, index) => {
      let dateText = eventEl.childNodes[0]?.nodeValue?.trim(); // <li> 태그의 첫 번째 텍스트 노드 (날짜)
      const linkEl = eventEl.querySelector("a");

      const title = linkEl ? linkEl.innerText.trim() : null;
      const link = linkEl ? linkEl.href : null;

      // 불필요한 문자(예: "└") 제거
      if (!dateText || dateText.includes("└")) {
        return;
      }

      // 날짜 변환: "4月5日〜4月6日" → ["4月5日", "4月6日"]
      const dateParts = dateText
        .replace(/[（）]/g, "")
        .split("〜")
        .map((d) => d.trim());

      // 연도를 추정 (현재 연도 사용)
      const currentYear = new Date().getFullYear();
      const formattedDates = dateParts
        .map((part) => {
          const match = part.match(/(\d{1,2})月(\d{1,2})日/);
          if (match) {
            const month = match[1].padStart(2, "0");
            const day = match[2].padStart(2, "0");
            return `${currentYear}-${month}-${day}`;
          }
          return null;
        })
        .filter(Boolean);

      // 유효한 날짜만 저장
      if (title && link && formattedDates.length > 0) {
        formattedDates.forEach((date) => {
          eventList.push({ title, date, link });
        });

        // 진행률 계산
        const progress = Math.round(
          ((index + 1) / document.querySelectorAll("li").length) * 100
        );
        console.log(
          `진행률: ${progress}% (${index + 1}/${
            document.querySelectorAll("li").length
          })`
        );
      }
    });

    return eventList;
  });

  await browser.close();

  // 크롤링한 데이터를 JSON 파일로 저장
  if (events.length > 0) {
    fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
    console.log(`${events.length}개의 이벤트 데이터 저장 완료!`);
  } else {
    console.log("이벤트 데이터를 찾을 수 없습니다.");
  }

  return events;
}

// 스크립트 실행
scrapeYoyogiEvents();
