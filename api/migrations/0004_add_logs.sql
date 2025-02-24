-- AlterTable
ALTER TABLE "submissions" ADD COLUMN "location" TEXT;

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'submission',
    "submissionId" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "message" TEXT,
    "code" INTEGER NOT NULL DEFAULT 200,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "logs_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_forms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Untitled Form',
    "userId" TEXT NOT NULL,
    "settings" TEXT NOT NULL DEFAULT '{}',
    "development" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_forms" ("createdAt", "id", "name", "settings", "updatedAt", "userId") SELECT "createdAt", "id", "name", "settings", "updatedAt", "userId" FROM "forms";
DROP TABLE "forms";
ALTER TABLE "new_forms" RENAME TO "forms";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
