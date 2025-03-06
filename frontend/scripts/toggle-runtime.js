const fs = require("fs");
const path = require("path");

const EXPECTED_FILES = 3;
const action = process.argv[2];

if (action !== "comment" && action !== "uncomment") {
  console.error("Usage: node toggle-edge-runtime.js [comment|uncomment]");
  process.exit(1);
}

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const srcPath = path.join(__dirname, "..", "src");
const files = findFiles(srcPath);

let modifiedCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let newContent = content;

  if (action === "comment") {
    newContent = content.replace(/^([ \t]*)export const runtime = "edge"/gm, '$1// export const runtime = "edge"');
  } else {
    newContent = content.replace(/^([ \t]*)\/\/ export const runtime = "edge"/gm, '$1export const runtime = "edge"');
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, "utf8");
    modifiedCount++;
    console.log(`Modified: ${file}`);
  }
});

console.log(`Done! Modified ${modifiedCount} files (expected ${EXPECTED_FILES}).`);
