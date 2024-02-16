/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uid` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Favorites";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "favorite_user_id" INTEGER NOT NULL,
    CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_favorite_user_id_fkey" FOREIGN KEY ("favorite_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("created_at", "id", "message", "receiver_id", "sender_id", "updated_at") SELECT "created_at", "id", "message", "receiver_id", "sender_id", "updated_at" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE UNIQUE INDEX "Message_uid_key" ON "Message"("uid");
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "create_user_id" INTEGER NOT NULL,
    "reviewed_user_id" INTEGER NOT NULL,
    CONSTRAINT "Review_create_user_id_fkey" FOREIGN KEY ("create_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewed_user_id_fkey" FOREIGN KEY ("reviewed_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("create_user_id", "created_at", "id", "rating", "review", "reviewed_user_id", "updated_at") SELECT "create_user_id", "created_at", "id", "rating", "review", "reviewed_user_id", "updated_at" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_uid_key" ON "Review"("uid");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "lat" REAL,
    "lng" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "available_to_host" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT,
    "profile_description" TEXT,
    "phone_number" TEXT
);
INSERT INTO "new_User" ("address", "available_to_host", "city", "country", "created_at", "email", "first_name", "id", "last_name", "lat", "lng", "password", "phone_number", "profile_description", "profile_picture", "state", "updated_at", "username", "zip") SELECT "address", "available_to_host", "city", "country", "created_at", "email", "first_name", "id", "last_name", "lat", "lng", "password", "phone_number", "profile_description", "profile_picture", "state", "updated_at", "username", "zip" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_uid_key" ON "Favorite"("uid");
