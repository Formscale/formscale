-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "otp" TEXT,
    "otpExpiry" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 3,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "stripeCustomerId" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "stripeSubscriptionId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "otp", "otpExpiry", "password", "role", "stripeCustomerId", "stripeSubscriptionId", "subscriptionTier", "updatedAt", "verified") SELECT "createdAt", "email", "id", "name", "otp", "otpExpiry", "password", "role", "stripeCustomerId", "stripeSubscriptionId", "subscriptionTier", "updatedAt", "verified" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
