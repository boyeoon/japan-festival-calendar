/*
  Warnings:

  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title_ja" TEXT NOT NULL DEFAULT '',
    "title_ko" TEXT NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_Event" ("date", "id", "link", "source") SELECT "date", "id", "link", "source" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
