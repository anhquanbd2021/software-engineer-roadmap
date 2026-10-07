import test from "node:test";
import assert from "node:assert/strict";
import { STAGES, progress, next, READINESS } from "../app/roadmap.mjs";

test("all eleven article stages exist", () => {
  assert.equal(STAGES.length, 11);
});

test("entry points have no prerequisites", () => {
  const entry = STAGES.filter((s) => s.prereq.length === 0).map((s) => s.id);
  assert.deepEqual(entry, ["fundamentals"]);
});

test("prerequisites reference real stages", () => {
  const ids = new Set(STAGES.map((s) => s.id));
  for (const s of STAGES) for (const p of s.prereq) assert.ok(ids.has(p), `${s.id} -> ${p}`);
});

test("no cycles in the graph", () => {
  const visit = (id, stack = []) => {
    if (stack.includes(id)) throw new Error("cycle: " + [...stack, id].join(">"));
    const s = STAGES.find((x) => x.id === id);
    for (const p of s.prereq) visit(p, [...stack, id]);
  };
  STAGES.forEach((s) => visit(s.id));
});

test("nothing but entry points is available at start", () => {
  assert.deepEqual(next([]), ["fundamentals"]);
});

test("system-design stays locked until backend and databases are done", () => {
  let p = progress(["fundamentals"]);
  assert.equal(p.stages.find((s) => s.id === "system-design").status, "locked");
  p = progress(["fundamentals", "databases", "backend"]);
  assert.equal(p.stages.find((s) => s.id === "system-design").status, "available");
});

test("cloud waits for docker and system-design", () => {
  const p = progress(["fundamentals", "databases", "backend", "docker"]);
  assert.equal(p.stages.find((s) => s.id === "cloud").status, "locked");
  const p2 = progress(["fundamentals", "databases", "backend", "docker", "system-design"]);
  assert.equal(p2.stages.find((s) => s.id === "cloud").status, "available");
});

test("progress percent is computed from completion", () => {
  assert.equal(progress([]).pct, 0);
  assert.equal(progress(STAGES.map((s) => s.id)).pct, 100);
});

test("missing prereqs are reported by id", () => {
  const p = progress(["fundamentals"]);
  const sd = p.stages.find((s) => s.id === "system-design");
  assert.deepEqual(sd.missing, ["backend", "databases"]);
});

test("readiness test mirrors the article", () => {
  assert.equal(READINESS.length, 3);
});
