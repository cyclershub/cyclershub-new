-- CreateTable
CREATE TABLE "ThreadSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    CONSTRAINT "ThreadSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ThreadSubscription_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ThreadSubscription_uid_key" ON "ThreadSubscription"("uid");
