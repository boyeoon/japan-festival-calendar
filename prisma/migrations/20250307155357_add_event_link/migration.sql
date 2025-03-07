/*
  Warnings:

  - Added the required column `link` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_Event" ("date", "id", "title") SELECT "date", "id", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
