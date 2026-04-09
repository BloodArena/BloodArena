/**
 * gen-index.js — Scan results/ directory and generate file_index.json
 * Usage: node benchmark/gen-index.js
 */

const fs = require("fs");
const path = require("path");

const RESULTS_DIR = path.resolve(__dirname, "..", "results");
const OUTPUT_FILE = path.join(RESULTS_DIR, "file_index.json");

function scan(dir, base) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scan(path.join(dir, entry.name), rel));
    } else if (entry.isFile() && (entry.name.endsWith(".json") || entry.name.endsWith(".jsonl"))) {
      if (entry.name === "file_index.json") continue;
      files.push(rel);
    }
  }
  return files;
}

const files = scan(RESULTS_DIR, "").sort();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2));
console.log(`Generated ${OUTPUT_FILE} (${files.length} files)`);
