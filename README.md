# Resume

---

This project will not have any further updates, sorry to inform you of this for now, this project was purchased by someone 20 days ago.
If you liked the project and still want to find out how the code was written, it will still be available!
To everyone who gave suggestions before, I did everything you asked for, suggestions for usernames, configProxy and optimization, the system was not opening another browser with each username in the new update. It just wasn't posted, sorry!

---

# @lookups/usernames

<p align="left">
  <a href="https://www.npmjs.com/package/@lookups/usernames"><img alt="npm version" src="https://img.shields.io/npm/v/%40lookups%2Fusernames?color=blue" /></a>
  <a href="https://www.npmjs.com/package/@lookups/usernames"><img alt="npm downloads" src="https://img.shields.io/npm/dm/%40lookups%2Fusernames" /></a>
</p>

Fast username availability checker for multiple platforms.
Now supports **Discord**, **GitHub**, **Instagram**, **Roblox**, and **Minecraft**.

---

## Installation

```bash
npm install @lookups/usernames
# or
pnpm add @lookups/usernames
# or
yarn add @lookups/usernames
```

---

## Quick Start

ESM / TypeScript:

```ts
import { Client } from "@lookups/usernames";

const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: false
  }
});

async function main() {
  const discord = await client.discord("alwayswealthy");
  const github = await client.github("pqpcara");
  const instagram = await client.instagram("muitaura");
  const roblox = await client.roblox("pqpcara");
  const minecraft = await client.minecraft("pqpcara");

  console.log({ discord, github, instagram, roblox, minecraft });
}

main();
```

CommonJS (dynamic import):

```js
(async () => {
  const { Client } = await import("@lookups/usernames");
  const client = new Client({
    suggestions: {
      enabled: true,
      amount: 3,
      verification: false
    }
  });
  const result = await client.github("pqpcara");
  console.log(result);
})();
```

Example output (Discord):
```json
{
  "platform": "discord",
  "username": "alwayswealthy",
  "available": false,
  "message": "Username alwayswealthy is not available."
}
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

Example output (Roblox):

```json
{
  "platform": "roblox",
  "username": "pqpcara",
  "available": true,
  "message": "Username is available"
}
```

Example output (Minecraft):

```json
{
  "platform": "minecraft",
  "username": "pqpcara",
  "available": true,
  "message": "Username is available"
}
```

---

## Usage Examples

Check a single username:

```ts
import { Client } from "@lookups/usernames";

const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: false
  }
});

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
import { Client } from "@lookups/usernames";
const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: false
  }
});

async function checkMany(usernames: string[]) {
  const [discord, github, instagram, minecraft, roblox] = await Promise.all([
    Promise.all(usernames.map((u) => client.discord(u))),
    Promise.all(usernames.map((u) => client.github(u))),
    Promise.all(usernames.map((u) => client.instagram(u))),
    Promise.all(usernames.map((u) => client.minecraft(u))),
    Promise.all(usernames.map((u) => client.roblox(u))),
  ]);
  return { discord, github, instagram, minecraft, roblox };
}

checkMany(["pqpcara", "muitaura"]).then(console.log);
```

Gentle concurrency (helps avoid bot detection):

```ts
import { Client } from "@lookups/usernames";
const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: false
  }
});

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

## Supported Platforms

- Roblox
- GitHub
- Instagram
- Minecraft
- Roblox

Planned:
- Twitter/X, TikTok, Reddit, and more (PRs welcome)

---

## Changelog

- Releases: https://github.com/pqpcara/usernames/releases
- Commit history: https://github.com/pqpcara/usernames/commits/main

---
