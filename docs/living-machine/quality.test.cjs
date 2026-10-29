"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const svg = fs.readFileSync(path.join(root, "assets/living-machine-banner.svg"), "utf8");
const terminalSvg = fs.readFileSync(path.join(root, "assets/profile-terminal.svg"), "utf8");
const heroSvg = fs.readFileSync(path.join(root, "assets/profile-editorial-2026.svg"), "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, "HTML must include the app script");
const js = match[1];

function pickFunction(name) {
  const needle = "  function " + name + "(";
  const start = js.indexOf(needle);
  assert.ok(start !== -1, "Missing function " + name);
  const end = js.indexOf("\n  function ", start + needle.length);
  return js.slice(start, end < 0 ? js.length : end);
}
const names = ["normalizeTime", "parseCaptions", "serializeCues", "parseCSV", "csvCell", "toCSV"];
const pure = new Function(
  "const text=(v)=>String(v==null?'':v);\n" +
  names.map(pickFunction).join("\n") +
  "\nreturn {normalizeTime,parseCaptions,serializeCues,parseCSV,csvCell,toCSV};"
)();

test("embedded browser application JavaScript compiles", () => {
  assert.doesNotThrow(() => new vm.Script(js, { filename: "living-machine-inline.js" }));
});
test("main app has accessible application shell and key utilities", () => {
  const ids = ["rain", "stage", "dock", "startButton", "startmenu", "projectList", "projectSearch"];
  for (const id of ids) assert.ok(html.includes('id="' + id + '"'), "Missing #" + id);
  for (const id of ["converter", "captions", "media", "data", "links", "notepad", "terminal", "system"]) {
    assert.ok(html.includes('data-open="' + id + '"') || html.includes('["' + id + '"'), "Missing application " + id);
  }
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-live="polite"/);
});
test("subtitle format conversions preserve text and normalized timings", () => {
  const cues = pure.parseCaptions("1\n00:00:01,000 --> 00:00:02,500\nHello\n\n2\n00:00:04,000 --> 00:00:05,000\nOlá");
  assert.equal(cues.length, 2);
  assert.equal(cues[0].start, "00:00:01.000");
  const vtt = pure.serializeCues(cues, "vtt");
  assert.match(vtt, /^WEBVTT\n/);
  assert.match(vtt, /00:00:01.000 --> 00:00:02.500/);
  assert.equal(pure.parseCaptions(vtt).length, 2);
  assert.match(pure.serializeCues(cues, "srt"), /00:00:01,000/);
});
test("CSV parser understands quoted delimiters and escaped quotes", () => {
  const rows = pure.parseCSV('name,description\n"Mary, Jane","Said ""hello"""\n');
  assert.deepEqual(rows.map(x => ({ ...x })), [{ name: "Mary, Jane", description: 'Said "hello"' }]);
});
test("CSV export guards spreadsheet formula prefixes without breaking negatives", () => {
  const output = pure.toCSV([{ name: "A,B", value: "=1+1" }, { name: "Normal", value: "-25" }]);
  const rows = pure.parseCSV(output);
  assert.equal(rows[0].value, "'=1+1");
  assert.equal(rows[1].value, "-25");
});
test("README links real local tools and an accessible static editorial cover", () => {
  assert.match(readme, /docs\/living-machine\/index\.html/);
  assert.match(readme, /assets\/profile-editorial-2026\.svg/);
  // Accept a clearly bounded local-source description without requiring
  // identical editorial wording in every profile revision.
  const toolsSection = readme.split("## Tools and experiments")[1] || "";
  assert.match(toolsSection, /not[^.\\n]{0,120}(?:verified|live|deployment)/i);
  assert.match(heroSvg, /<svg/);
  assert.match(heroSvg, /<title[^>]*>/);
  assert.match(heroSvg, /<desc[^>]*>/);
  // The historical terminal illustration remains available to the browser toolkit.
  assert.match(terminalSvg, /<svg/);
  assert.match(terminalSvg, /BELENTANI LIVING MACHINE/);
  assert.match(svg, /<svg/);
  assert.match(svg, /animateTransform/);
});
test("utility interface contains no background content-upload fetch", () => {
  assert.doesNotMatch(js, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.match(html, /No third-party download or remote processing/);
});
