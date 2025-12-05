const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Path to changelog
const changelogPath = path.join(__dirname, "CHANGELOG.json");

// Load old changelog content
let changelog = { changes: [] };

if (fs.existsSync(changelogPath)) {
  try {
    changelog = JSON.parse(fs.readFileSync(changelogPath, "utf8"));
  } catch (e) {
    console.error("Error reading CHANGELOG.json:", e);
  }
}

// Get the latest commit message
let commitMessage = "";
try {
  commitMessage = execSync("git log -1 --pretty=%B").toString().trim();
} catch (e) {
  console.error("Cannot read last commit message:", e);
  process.exit(1);
}

// Auto-generate version number
const version = `v${changelog.changes.length + 1}.${new Date().getMonth() + 1}.${new Date().getDate()}`;

// New entry
const newEntry = {
  version,
  date: new Date().toISOString(),
  message: commitMessage
};

// Push to the changelog
changelog.changes.push(newEntry);

// Save updated changelog
fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));

console.log("CHANGELOG updated:", newEntry);
