# Usernames

A username availability checker using Puppeteer. Currently, it only supports GitHub, but it's ready for new checkers for other platforms.

## Requirements

- Node.js 18 or higher
- An environment capable of running Chromium downloaded by Puppeteer.

## Installation

Install the library from npm:

```bash
npm install @muitaura/usernames
```

Or using pnpm/yarn:

```bash
pnpm add @muitaura/usernames
# or
yarn add @muitaura/usernames
```

Puppeteer is included as a dependency.

## Quick Start

ESM/TypeScript example:

```ts
import { Client } from "@muitaura/usernames";

const client = new Client();

const main = async () => {
  const result = await client.github("pqpcara");
  console.log(result);
};

main();
```

Typical output:

```json
{
  "platform": "github",
  "username": "pqpcara",
  "available": false,
  "suggestions": "pqpcara-prog, pqpcara-cpu, or pqpcara423 are available.",
  "message": "Username pqpcara is not available."
}
```

- `available`: `true` if the username is available, `false` if it's taken, and `null` if it could not be determined.
- `suggestions`: A string with suggestions from the page, if available.
- `message`: A status message from the page, if available.

CommonJS with dynamic import:

```js
(async () => {
  const { Client } = await import("@muitaura/usernames");
  const client = new Client();
  const result = await client.github("pqpcara");
  console.log(result);
})();
```

## API

### Classes

- `Client`
  - `github(username: string): Promise<CheckResult>`
    - Checks the availability of a username on GitHub.

### Types

```ts
export interface CheckResult {
  platform: string;
  username: string;
  available: boolean | null;
  suggestions?: string | null;
  message?: string | null;
  error?: string | null; // Reserved for future use
}
```

**Note:** The `message` field is currently used for error details if the check fails.

## Examples

### Check multiple usernames in parallel

```ts
import { Client } from "@muitaura/usernames";

const client = new Client();

async function checkMany(usernames: string[]) {
  return Promise.all(usernames.map((u) => client.github(u)));
}

checkMany(["pqpcara", "pqpcara1", "pqpcara2", "pqpcara3"]).then(console.log);
```

### Error Handling

```ts
import { Client } from "@muitaura/usernames";

const client = new Client();

async function run() {
  try {
    const res = await client.github("pqpcara");
    if (res.available === true) {
      console.log(`Available: ${res.username}`);
    } else if (res.available === false) {
      console.log(`Unavailable: ${res.username}`);
      if (res.suggestions) {
        console.log("Page suggestions:", res.suggestions);
      }
    } else {
      console.log("Could not determine availability:", res.message);
    }
  } catch (e) {
    console.error("Check failed:", e);
  }
}

run();
```

## How it works

- The package uses Puppeteer to open a headless Chromium instance.
- For GitHub, it checks the sign-up page by typing the username and reading the UI validation elements.
- It uses small random delays between actions to simulate human behavior.

**Implications:**

- Frequent and repeated executions might trigger anti-bot protections.
- In CI/container environments, you might need to adjust Chromium flags/environment variables.