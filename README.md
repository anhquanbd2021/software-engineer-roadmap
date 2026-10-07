# Roadmap Tracker — companion demo

Interactive tracker for the article *Software Engineer Roadmap: From
Fundamentals to Production*. The eleven stages form a dependency graph —
`cloud` waits for `docker` + `system-design`, `system-design` waits for
`backend` + `databases`. Mark stages done, watch what unlocks, and see which
prerequisites are still missing.

Zero dependencies — Node 20+ only. `app/roadmap.mjs` holds the graph and the
progress logic, shared by the server, the browser UI, and the tests.

## The readiness test

The article's rule for "done" is built in: a stage counts only when you've
*used it in a project*, *can explain the trade-offs*, and *can debug it at
2 AM* — not when the tutorial ended.

## Run it

```text
npm start   # tracker on :3000
npm test    # DAG integrity, unlock order, missing-prereq reporting
```
