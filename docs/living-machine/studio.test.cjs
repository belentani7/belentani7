"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const base = __dirname;
const core = require(path.join(base, "studio-core.js"));
const html = fs.readFileSync(path.join(base, "studio.html"), "utf8");
const js = fs.readFileSync(path.join(base, "studio.js"), "utf8");
const css = fs.readFileSync(path.join(base, "studio.css"), "utf8");

test("Studio sources load and parse without external modules", () => {
  assert.doesNotThrow(() => new vm.Script(js));
  assert.ok(html.includes('<script src="./studio-core.js" defer>'));
  assert.ok(html.includes('<script src="./studio.js" defer>'));
  assert.ok(html.includes('<link rel="stylesheet" href="./studio.css">'));
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
  assert.doesNotMatch(js, /\bfetch\s*\(/);
});
test("all seven applications have accessible panels", () => {
  for (const id of ["batch", "subtitles", "cv", "storyboard", "palette", "pdf", "audio"]) {
    assert.match(html, new RegExp('data-tab="' + id + '"'));
    assert.match(html, new RegExp('id="tab-' + id + '"'));
  }
  assert.match(html, /href="#workspace"/);
  assert.match(css, /prefers-reduced-motion/);
});
test("ZIP uses valid local file headers, central directory and CRC-32", async () => {
  assert.equal(core.crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  const zip = core.zipFiles([{name:"hello.txt",data:new TextEncoder().encode("hello")}]);
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(0,true),0x04034b50);
  assert.equal(view.getUint32(bytes.length-22,true),0x06054b50);
  assert.equal(view.getUint16(bytes.length-12,true),1);
  assert.equal(view.getUint32(14,true),core.crc32(new TextEncoder().encode("hello")));
});
test("ZIP rejects path traversal names", async () => {
  assert.equal(core.safeFilename("../../private.key"),"_.._private.key");
  const blob=core.zipFiles([{name:"../bad.txt",data:new Uint8Array([42])}]);
  const raw = new TextDecoder().decode(await blob.arrayBuffer());
  assert.doesNotMatch(raw,/\.\.\/bad\.txt/);
});
test("caption conversions support SRT/VTT, normalized timings and offset", () => {
  const srt="1\n00:00:01,250 --> 00:00:03,000\nHola\n\n2\n00:00:04,500 --> 00:00:07,000\nHello";
  const c=core.parseCaptions(srt);
  assert.equal(c.length,2);
  const shifted=core.offsetCaptions(c,750);
  assert.equal(shifted[0].start,2000);
  const vtt=core.subtitleExport(shifted,"vtt");
  assert.match(vtt,/00:00:02.000 --> 00:00:03.750/);
  assert.equal(core.parseCaptions(vtt).length,2);
  assert.equal(core.subtitleExport(shifted,"txt"),"Hola\nHello");
  assert.throws(()=>core.parseCaptions("00:00:10,000 --> 00:00:01,000\nBad"));
});
test("Storyboard CSV resists common spreadsheet formulas", () => {
  const csv=core.storyboardCSV([{seconds:"3",camera:"close",movement:"dolly",visual:"=HYPERLINK(\"evil\")",audio:"+CALC",notes:"first, second"}]);
  assert.match(csv,/'=HYPERLINK/);
  assert.match(csv,/'\+CALC/);
  assert.match(csv,/"first, second"/);
});
test("CV analysis is deterministic and not a fictional ATS score", () => {
  const r=core.analyzeCV("Experience\nI built projects on GitHub. Skills: Python. Education: studies. Contact: hello@example.com.");
  assert.equal(r.sections.experience,true);
  assert.equal(r.sections.skills,true);
  assert.equal(r.contact.email,true);
  assert.ok(Array.isArray(r.suggestions));
  assert.equal(Object.hasOwn(r,"score"),false);
  assert.match(r.disclaimer,/not ATS/i);
});
test("Text metrics and basic HTML escaping work", () => {
  const m=core.getTextMetrics("One two\nThree");assert.equal(m.words,3);assert.equal(m.lines,2);
  assert.equal(core.escapeHTML('<a title="X">&</a>'),'&lt;a title=&quot;X&quot;&gt;&amp;&lt;/a&gt;');
});
