// roadmap.mjs — the article's eleven-stage roadmap as a dependency graph.
// A stage unlocks when its prerequisites are done; progress is computed, not
// stored. Pure module: shared by app/server.js, the browser UI, and tests.

export const STAGES = [
  {
    id: "fundamentals", name: "Programming Fundamentals", prereq: [],
    skills: ["variables, types, functions", "error handling", "reading error messages", "one language deeply before two shallowly"],
  },
  {
    id: "dsa", name: "Data Structures & Algorithms", prereq: ["fundamentals"],
    skills: ["arrays, maps, sets, trees, graphs", "complexity intuition", "recognize the shape, not memorize the answer"],
  },
  {
    id: "git", name: "Git & GitHub", prereq: ["fundamentals"],
    skills: ["branch / commit / PR", "rebase vs merge", "reading history when something breaks"],
  },
  {
    id: "databases", name: "Databases", prereq: ["fundamentals"],
    skills: ["SQL + one document store", "indexes and query plans", "migrations on real data"],
  },
  {
    id: "backend", name: "Backend Development", prereq: ["fundamentals", "databases"],
    skills: ["request lifecycle", "auth sessions vs tokens", "validation at the boundary"],
  },
  {
    id: "apis", name: "APIs", prereq: ["backend"],
    skills: ["REST + one alternative", "versioning", "idempotency and error contracts"],
  },
  {
    id: "system-design", name: "System Design", prereq: ["backend", "databases"],
    skills: ["caching", "queues and backpressure", "consistency trade-offs"],
  },
  {
    id: "docker", name: "Docker", prereq: ["backend"],
    skills: ["images and layers", "compose for local stacks", "why the container isn't the app"],
  },
  {
    id: "cloud", name: "Cloud Platforms", prereq: ["docker", "system-design"],
    skills: ["compute / storage / network primitives", "IAM least privilege", "cost as a design constraint"],
  },
  {
    id: "cicd", name: "CI/CD", prereq: ["git", "docker"],
    skills: ["pipeline stages", "test gates", "rollbacks as a feature"],
  },
  {
    id: "projects", name: "Projects", prereq: ["fundamentals"],
    skills: ["small enough to finish", "deployed, not local", "a README that explains trade-offs"],
  },
];

export function progress(doneIds) {
  const done = new Set(doneIds);
  const stages = STAGES.map((s) => {
    const missing = s.prereq.filter((p) => !done.has(p));
    return {
      ...s,
      status: done.has(s.id) ? "done" : missing.length === 0 ? "available" : "locked",
      missing,
    };
  });
  const pct = Math.round((done.size / STAGES.length) * 100);
  return { stages, pct, done: [...done] };
}

// "What should I learn next" — available stages, cheapest-first
export function next(doneIds) {
  const { stages } = progress(doneIds);
  return stages.filter((s) => s.status === "available").map((s) => s.id);
}

// the article's readiness check: a stage counts when you can use, explain, debug it
export const READINESS = ["used it in a project", "can explain the trade-offs", "can debug it at 2 AM"];
