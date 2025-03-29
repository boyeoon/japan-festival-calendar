# Japan Festival Calendar

This website is currently hosted at [**japan-festival-calendar**](https://jfestcal.vercel.app/).

일본의 다양한 축제와 이벤트 정보를 한눈에 볼 수 있는 달력 앱입니다.

|                           |                                  |                                    |
| ------------------------- | -------------------------------- | ---------------------------------- |
| [**English**](/README.md) | [**Korean**](/docs/README_ko.md) | [**Japanese**](/docs/README_jp.md) |

## Tech Stack

- [**React**](https://react.dev/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**dayjs**](https://github.com/iamkun/dayjs)

## Folder Structure

```
/japan-festival-calendar
├── /app
│ ├── /api
│ │ ├── events/
│ │ └── holidays/
│ ├── /components
│ │ ├── button/
│ │ ├── calendar/
│ │ ├── event/
│ │ └── ...
│ ├── /crawling
│ │ ├── data/
│ │ │ ├── crawlYoyogi.json
│ │ │ ├── events.ts
│ │ │ └── ...
│ │ └── ...
├── package.json
├── README.md
└── ...
```

<!-- 모바일 때 이벤트 2개 보이게 하려고 커스텀 훅 만들었는데 일딴 필요없어서 주석처리함 파일을 올라가 있음 -->
