-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "location" TEXT NOT NULL DEFAULT 'Unknown',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_submissions" ("createdAt", "data", "formId", "id", "location", "status", "updatedAt") SELECT "createdAt", "data", "formId", "id", coalesce("location", 'Unknown') AS "location", "status", "updatedAt" FROM "submissions";
DROP TABLE "submissions";
ALTER TABLE "new_submissions" RENAME TO "submissions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
