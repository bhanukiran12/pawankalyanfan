/**
 * Print VAPID keys for Web Push. Add them to Render (or .env) — never commit the private key.
 * Run: node scripts/generate-vapid-keys.mjs
 */
import { execSync } from "child_process";

const out = execSync("npx --yes web-push generate-vapid-keys", { encoding: "utf8" });
const publicMatch = out.match(/Public Key:\s*\n([^\n]+)/);
const privateMatch = out.match(/Private Key:\s*\n([^\n]+)/);

if (!publicMatch || !privateMatch) {
  console.error("Could not parse keys. Run: npx web-push generate-vapid-keys");
  process.exit(1);
}

const publicKey = publicMatch[1].trim();
const privateKey = privateMatch[1].trim();

console.log("\nAdd these to Render → pawankalyanfan → Environment (then redeploy):\n");
console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${publicKey}`);
console.log("VAPID_SUBJECT=mailto:admin@pawankalyanfan.com\n");
console.log("For local dev, copy the same lines into your root .env file.\n");
