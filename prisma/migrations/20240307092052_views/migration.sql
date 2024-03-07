-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Forum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Forum" ("created_at", "description", "id", "slug", "title", "uid", "updated_at") SELECT "created_at", "description", "id", "slug", "title", "uid", "updated_at" FROM "Forum";
DROP TABLE "Forum";
ALTER TABLE "new_Forum" RENAME TO "Forum";
CREATE UNIQUE INDEX "Forum_uid_key" ON "Forum"("uid");
CREATE UNIQUE INDEX "Forum_title_key" ON "Forum"("title");
CREATE UNIQUE INDEX "Forum_slug_key" ON "Forum"("slug");
CREATE TABLE "new_Thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "forum_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Thread_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "Forum" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Thread_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Thread" ("created_at", "description", "forum_id", "id", "slug", "title", "uid", "updated_at", "user_id") SELECT "created_at", "description", "forum_id", "id", "slug", "title", "uid", "updated_at", "user_id" FROM "Thread";
DROP TABLE "Thread";
ALTER TABLE "new_Thread" RENAME TO "Thread";
CREATE UNIQUE INDEX "Thread_uid_key" ON "Thread"("uid");
CREATE UNIQUE INDEX "Thread_slug_key" ON "Thread"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
