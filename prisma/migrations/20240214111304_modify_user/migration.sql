/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "available_to_host" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT,
    "profile_description" TEXT,
    "phone_number" TEXT
);
INSERT INTO "new_User" ("address", "available_to_host", "city", "created_at", "email", "first_name", "id", "last_name", "password", "phone_number", "profile_description", "profile_picture", "state", "updated_at", "username", "zip") SELECT "address", "available_to_host", "city", "created_at", "email", "first_name", "id", "last_name", "password", "phone_number", "profile_description", "profile_picture", "state", "updated_at", "username", "zip" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
