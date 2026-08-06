import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
);
const wranglerConfig = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "wrangler.jsonc"), "utf8"),
);

assert.equal(
  packageJson.scripts.build,
  "next build",
  "The normal Next.js build command must remain available",
);
assert.equal(
  packageJson.scripts.preview,
  "opennextjs-cloudflare build && opennextjs-cloudflare preview",
);
assert.equal(
  packageJson.scripts.deploy,
  "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
);
assert.equal(
  packageJson.scripts.upload,
  "opennextjs-cloudflare build && opennextjs-cloudflare upload",
);
assert.equal(
  packageJson.scripts["cf-typegen"],
  "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
);
assert.equal(
  packageJson.scripts["test:cloudflare-opennext"],
  "node tests/cloudflare-opennext-config.test.mjs",
);

assert.ok(
  packageJson.dependencies?.["@opennextjs/cloudflare"],
  "OpenNext must be installed for the Next.js configuration and Workers build",
);
assert.ok(
  packageJson.devDependencies?.wrangler,
  "Wrangler must be installed as build tooling",
);

assert.equal(wranglerConfig.name, "wendanswer");
assert.equal(wranglerConfig.main, ".open-next/worker.js");
assert.equal(wranglerConfig.assets?.binding, "ASSETS");
assert.equal(wranglerConfig.assets?.directory, ".open-next/assets");
assert.ok(wranglerConfig.compatibility_flags?.includes("nodejs_compat"));
assert.ok(
  wranglerConfig.compatibility_flags?.includes("global_fetch_strictly_public"),
);

assert.deepEqual(wranglerConfig.services, [
  { binding: "WORKER_SELF_REFERENCE", service: "wendanswer" },
]);
assert.deepEqual(wranglerConfig.r2_buckets, [
  {
    binding: "NEXT_INC_CACHE_R2_BUCKET",
    bucket_name: "wendanswer-next-cache",
  },
]);
assert.deepEqual(wranglerConfig.durable_objects?.bindings, [
  { name: "NEXT_CACHE_DO_QUEUE", class_name: "DOQueueHandler" },
]);
assert.ok(
  wranglerConfig.migrations?.some(
    (migration) =>
      migration.tag === "v1" &&
      migration.new_sqlite_classes?.includes("DOQueueHandler"),
  ),
  "The Durable Object queue must have a SQLite migration",
);

console.log("Cloudflare OpenNext deployment contract test passed");
