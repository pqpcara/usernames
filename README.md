# Usernames

<p align="left">
  <a href="https://www.npmjs.com/package/@muitaura/usernames"><img alt="npm version" src="https://img.shields.io/npm/v/%40muitaura%2Fusernames?color=blue" /></a>
  <a href="https://www.npmjs.com/package/@muitaura/usernames"><img alt="npm downloads" src="https://img.shields.io/npm/dm/%40muitaura%2Fusernames" /></a>
  <img alt="node >= 18" src="https://img.shields.io/badge/node-%3E%3D18.0-43853d" />
</p>

A username availability checker using Puppeteer. Currently, it only supports GitHub, but it's ready for new checkers for other platforms.

---

## Installation

```bash
npm install @muitaura/usernames
# or
pnpm add @muitaura/usernames
# or
yarn add @muitaura/usernames
```

Requirements:
- Node.js 18+
- Puppeteer downloads a compatible Chromium by default (unless configured otherwise)

---

## Quick Start

ESM / TypeScript:

```ts
import { Client } from "@muitaura/usernames";

const client = new Client();

async function main() {
  const github = await client.github("pqpcara");
  const instagram = await client.instagram("muitaura");

  console.log("GitHub:", github);
  console.log("Instagram:", instagram);
}

main();
```

CommonJS (dynamic import):

```js
(async () => {
  const { Client } = await import("@muitaura/usernames");
  const client = new Client();
  const result = await client.github("pqpcara");
  console.log(result);
})();
```

Example output (GitHub):

```json
{
  "platform": "github",
  "username": "pqpcara",
  "available": false,
  "suggestions": "pqpcara-dev, pqpcara2, or pqpcara232 are available.",
  "message": "Username pqpcara is not available."
}
```

Example output (Instagram):

```json
{
  "platform": "instagram",
  "username": "muitaura",
  "available": true,
  "message": "Username is available"
}
```

---

## Usage Examples

Check a single username:

```ts
import { Client } from "@muitaura/usernames";

const client = new Client();

const res = await client.github("pqpcara");
if (res.available === true) {
  console.log(`Available: ${res.username}`);
} else if (res.available === false) {
  console.log(`Unavailable: ${res.username}`);
  if (res.suggestions) console.log("Suggestions:", res.suggestions);
} else {
  console.log("Undetermined:", res.message);
}
```

Check multiple usernames in parallel:

```ts
import { Client } from "@muitaura/usernames";
const client = new Client();

async function checkMany(usernames: string[]) {
  const [github, instagram] = await Promise.all([
    Promise.all(usernames.map((u) => client.github(u))),
    Promise.all(usernames.map((u) => client.instagram(u))),
  ]);
  return { github, instagram };
}

checkMany(["pqpcara", "muitaura"]).then(console.log);
```

Gentle concurrency (helps avoid bot detection):

```ts
import { Client } from "@muitaura/usernames";
const client = new Client();

async function serial(usernames: string[]) {
  const out = [];
  for (const u of usernames) {
    out.push(await client.instagram(u));
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700));
  }
  return out;
}
```

---

## API Reference

### Class: Client

Creates a high-level client that exposes per-platform checkers.

- `github(username: string): Promise<CheckResult>`
- `instagram(username: string): Promise<CheckResult>`

### Types

```ts
export interface CheckResult {
  platform: string;            // "github" | "instagram" | ...
  username: string;            // the username that was checked
  available: boolean | null;   // true=available, false=taken, null=unknown
  suggestions?: string | null; // platform-suggested alternatives (GitHub)
  message?: string | null;     // human-readable status or error
}
```

---

## Supported Platforms

- GitHub
  - Uses the official sign-up flow and reads `auto-check` UI validation
  - May include platform suggestions when the username is taken
  - If you get `available: null`, GitHub likely changed UI; update selectors
- Instagram
  - Interacts with the sign-up page and inspects the validation icons/messages
  - UI classes change frequently; if results become `null`, refresh selectors
  - Add jitter and keep concurrency low to minimize anti-bot triggers

Planned:
- Twitter/X, TikTok, Reddit, and more (PRs welcome)


---

## Changelog

- Releases: https://github.com/pqpcara/usernames/releases
- Commit history: https://github.com/pqpcara/usernames/commits/main

---
