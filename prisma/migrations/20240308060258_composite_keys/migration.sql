/*
  Warnings:

  - The primary key for the `ThreadSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ThreadSubscription` table. All the data in the column will be lost.
  - The primary key for the `ForumSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ForumSubscription` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ThreadSubscription" (
    "uid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "thread_id"),
    CONSTRAINT "ThreadSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ThreadSubscription_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ThreadSubscription" ("created_at", "thread_id", "uid", "updated_at", "user_id") SELECT "created_at", "thread_id", "uid", "updated_at", "user_id" FROM "ThreadSubscription";
DROP TABLE "ThreadSubscription";
ALTER TABLE "new_ThreadSubscription" RENAME TO "ThreadSubscription";
CREATE UNIQUE INDEX "ThreadSubscription_uid_key" ON "ThreadSubscription"("uid");
CREATE TABLE "new_ForumSubscription" (
    "uid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "forum_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "forum_id"),
    CONSTRAINT "ForumSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ForumSubscription_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "Forum" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ForumSubscription" ("created_at", "forum_id", "uid", "updated_at", "user_id") SELECT "created_at", "forum_id", "uid", "updated_at", "user_id" FROM "ForumSubscription";
DROP TABLE "ForumSubscription";
ALTER TABLE "new_ForumSubscription" RENAME TO "ForumSubscription";
CREATE UNIQUE INDEX "ForumSubscription_uid_key" ON "ForumSubscription"("uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
