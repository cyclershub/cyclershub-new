/*
  Warnings:

  - Added the required column `slug` to the `Forum` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Forum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Forum" ("created_at", "description", "id", "title", "uid", "updated_at") SELECT "created_at", "description", "id", "title", "uid", "updated_at" FROM "Forum";
DROP TABLE "Forum";
ALTER TABLE "new_Forum" RENAME TO "Forum";
CREATE UNIQUE INDEX "Forum_uid_key" ON "Forum"("uid");
CREATE UNIQUE INDEX "Forum_title_key" ON "Forum"("title");
CREATE UNIQUE INDEX "Forum_slug_key" ON "Forum"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
