const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const changelogPath = path.join(__dirname, "CHANGELOG.json");
let changelog = { changes: [] };

if (fs.existsSync(changelogPath)) {
  try {
    changelog = JSON.parse(fs.readFileSync(changelogPath, "utf8"));
  } catch (e) {
    console.error("Error reading CHANGELOG.json:", e);
  }
}
let commitMessage = "";
try {
  commitMessage = execSync("git log -1 --pretty=%B").toString().trim();
} catch (e) {
  console.error("Cannot read last commit message:", e);
  process.exit(1);
}
function getNextVersion() {
  if (changelog.changes.length === 0) {
    return "v1.0.0";
  }
  
  const lastEntry = changelog.changes[changelog.changes.length - 1];
  const lastVersion = lastEntry.version || "v1.0.0";

  const match = lastVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
  
  if (match) {
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    const patch = parseInt(match[3]);
    
    return `v${major}.${minor}.${patch + 1}`;
  }
  
  return `v1.0.${changelog.changes.length}`;
}
const version = getNextVersion();

const newEntry = {
  version,
  date: new Date().toISOString(),
  message: commitMessage
};

changelog.changes.push(newEntry);
fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));

console.log("CHANGELOG updated:", newEntry);