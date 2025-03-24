# Japan Festival Calendar

This website is currently hosted at [**japan-festival-calendar**](https://jfestcal.vercel.app/).

일본의 다양한 축제와 이벤트 정보를 한눈에 볼 수 있는 달력 앱입니다.  
이벤트 데이터는 JSON 파일로 관리되며, `Next.js` 기반으로 제작되었습니다.

|                           |                                  |                                    |
| ------------------------- | -------------------------------- | ---------------------------------- |
| [**English**](/README.md) | [**Korean**](/docs/README_ko.md) | [**Japanese**](/docs/README_jp.md) |

<!-- ## Features

- When users guess a Pokémon name, the corresponding Pokémon sprite is displayed dynamically.
- Users can see the number of Pokémon they have guessed correctly and how many are left in real-time.
- The application supports responsive design for various screen sizes.
- There is an option to display or hide the Pokédex number. -->

## 데이터 구조

각 JSON 파일은 아래와 같은 구조를 가집니다:

```json
{
  "id": 1,
  "title_ja": "タイトル（日本語）",
  "title_ko": "제목 (한국어)",
  "title_en": "Title (English)",
  "date": "2025-03-07",
  "link": "https://example.com",
  "source": "yoyogi"
}
```

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

<!-- ## License

This project is licensed under the [MIT 라이센스](https://mit-license.org/). -->
