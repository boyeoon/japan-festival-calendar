-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title_ja" TEXT NOT NULL DEFAULT '',
    "title_ko" TEXT NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL
);
