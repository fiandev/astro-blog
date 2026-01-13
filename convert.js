// convert.js — FINAL FIX BLOGS (TRAILING COMMA AMAN)
import fs from "fs";

const sql = fs.readFileSync("goblog.sql", "utf8");

function clean(v) {
  if (v == null) return null;
  v = v.trim();
  if (v.toUpperCase() === "NULL") return null;
  if (v[0] === "'" && v[v.length - 1] === "'") {
    return v
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r");
  }
  if (!isNaN(v)) return Number(v);
  return v;
}

function splitVals(s) {
  const out = [];
  let cur = "",
    q = false,
    e = false;
  for (const c of s) {
    if (e) {
      cur += c;
      e = false;
      continue;
    }
    if (c === "\\") {
      cur += c;
      e = true;
      continue;
    }
    if (c === "'") {
      q = !q;
      cur += c;
      continue;
    }
    if (c === "," && !q) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function extractRows(block) {
  const rows = [];
  let buf = "",
    depth = 0,
    q = false,
    e = false;

  for (let i = 0; i < block.length; i++) {
    const c = block[i];

    if (e) {
      if (depth) buf += c;
      e = false;
      continue;
    }
    if (c === "\\") {
      if (depth) buf += c;
      e = true;
      continue;
    }
    if (c === "'") {
      if (depth) buf += c;
      q = !q;
      continue;
    }

    if (!q) {
      if (c === "(") {
        depth++;
        if (depth === 1) {
          buf = "";
          continue;
        }
      }
      if (c === ")") {
        depth--;
        if (depth === 0) {
          rows.push(buf);
          buf = "";
          continue;
        }
      }
    }
    if (depth) buf += c;
  }
  return rows;
}

// ambil kolom dari CREATE TABLE
const columns = {};
const createRe = /CREATE TABLE\s+`(\w+)`\s*\(([\s\S]*?)\)\s*ENGINE=/gi;
let m;
while ((m = createRe.exec(sql))) {
  const table = m[1];
  columns[table] = m[2]
    .split("\n")
    .map((l) => l.match(/^\s*`([^`]+)`/))
    .filter(Boolean)
    .map((x) => x[1]);
}

// ambil INSERT per tabel SAMPAI UNLOCK TABLES
const out = {};
const insertBlockRe =
  /INSERT INTO\s+`(\w+)`\s+VALUES\s*([\s\S]*?)UNLOCK TABLES;/gi;

while ((m = insertBlockRe.exec(sql))) {
  const table = m[1];
  const block = m[2];
  const cols = columns[table] || [];
  out[table] = [];

  const rows = extractRows(block);
  for (const r of rows) {
    const vals = splitVals(r).map(clean);
    const o = {};
    cols.forEach((c, i) => (o[c] = vals[i] ?? null));
    out[table].push(o);
  }
}

fs.writeFileSync("output.json", JSON.stringify(out, null, 2));
Object.keys(out).forEach((t) => console.log(t, out[t].length));
