const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = path.join(__dirname, "../migrations");
const DB_NAME = "formhook-db";

function getNextMigration() {
  const files = fs.readdirSync(MIGRATIONS_DIR);

  if (!MIGRATIONS_DIR) {
    console.error("Migrations directory not found");
    process.exit(1);
  }

  if (files.length === 0) return "0001";

  const lastFile = files.sort().pop();
  const lastNumber = parseInt(lastFile.split("_")[0]);
  return (lastNumber + 1).toString().padStart(4, "0");
}

function baseMigration(name, isRemote = false, shouldApply = false, migrationCommand) {
  execSync(`pnpm wrangler d1 migrations create ${DB_NAME} ${name}`, { stdio: "inherit" });

  execSync(migrationCommand, { stdio: "inherit" });

  if (shouldApply) {
    if (isRemote) {
      execSync(`pnpm wrangler d1 migrations apply ${DB_NAME} --remote`, { stdio: "inherit" });
    } else {
      execSync(`pnpm wrangler d1 migrations apply ${DB_NAME}`, { stdio: "inherit" });
    }

    execSync("pnpm run generate", { stdio: "inherit" });
  }
}

function createMigration(name, isRemote = false, shouldApply = false) {
  const number = getNextMigration();
  const fileName = `${number}_${name}.sql`;

  const migrationCommand = `pnpm prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/${fileName}`;

  baseMigration(name, isRemote, shouldApply, migrationCommand);
}

function createInitialMigration(name, isRemote = false, shouldApply = false) {
  const fileName = `0001_${name}.sql`;

  const migrationCommand = `pnpm prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/${fileName}`;

  baseMigration(name, isRemote, shouldApply, migrationCommand);
}

const args = process.argv.slice(2);
const name = args.find((arg) => !arg.startsWith("--"));
const isRemote = args.includes("--remote");
const shouldApply = args.includes("--apply") || isRemote;
const isInitial = args.includes("--initial");

if (!name) {
  console.error("Please provide a migration name");
  process.exit(1);
}

if (isInitial) {
  createInitialMigration(name, isRemote, shouldApply);
} else {
  createMigration(name, isRemote, shouldApply);
}

// "apply": "wrangler d1 migrations apply formhook-db && pnpm run generate",
// "apply:remote": "wrangler d1 migrations apply formhook-db --remote && pnpm run generate",
// "create": "npx wrangler d1 migrations create formhook-db add_logs",
// "initial": "npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql",
// "update": "npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0004_add_logs.sql",
