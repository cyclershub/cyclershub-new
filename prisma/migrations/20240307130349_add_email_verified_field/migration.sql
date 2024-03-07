-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "available_to_host" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "biography" TEXT,
    "banner" TEXT,
    "phone_number" TEXT
);
INSERT INTO "new_User" ("address", "available_to_host", "avatar", "banner", "biography", "city", "country", "created_at", "email", "first_name", "id", "last_name", "lat", "lng", "password", "phone_number", "state", "uid", "updated_at", "username", "zip") SELECT "address", "available_to_host", "avatar", "banner", "biography", "city", "country", "created_at", "email", "first_name", "id", "last_name", "lat", "lng", "password", "phone_number", "state", "uid", "updated_at", "username", "zip" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
