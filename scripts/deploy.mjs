// Check everything, then publish: pushes main to GitHub, where the
// "Deploy Static Site to GitHub Pages" workflow runs the same checks again,
// builds and puts the site live on https://sos-abdichtung.de.
//
//   pnpm release            check, then push main
//   pnpm release --check    only run the checks (nothing is pushed)
import { spawnSync } from "node:child_process";

const checkOnly = process.argv.includes("--check");
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...opts });
  return r.status === 0;
};
const out = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32" }).stdout.trim();
const fail = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

console.log("\n1/3  Checks: types, build, SEO and links\n");
if (!run("pnpm", ["check"])) fail("Checks failed. Nothing was published. Fix the errors above and run again.");
if (checkOnly) {
  console.log("\n✓ All checks passed (check only, nothing pushed).\n");
  process.exit(0);
}

console.log("\n2/3  Git status\n");
const branch = out("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") fail(`You are on "${branch}". Publishing goes from main: merge your changes into main first (or run: git checkout main && git pull).`);
if (out("git", ["status", "--porcelain"])) fail("There are uncommitted changes. Commit them first (git add -A && git commit -m \"...\").");
if (!run("git", ["pull", "--ff-only", "origin", "main"])) fail("Could not update main from GitHub. Resolve that first.");

console.log("\n3/3  Publish\n");
if (!run("git", ["push", "origin", "main"])) fail("Push failed.");
console.log(`
✓ Pushed. GitHub now checks, builds and deploys (about 1-2 minutes):
    Progress: https://github.com/avaisqarni365/SOS24/actions
    Live:     https://sos-abdichtung.de/
`);
