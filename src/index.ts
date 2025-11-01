import { Client } from "./core/client.js";

export * from "./core/client.js";

const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: true
  }
});

console.log(await client.instagram("muitaura"));
console.log(await client.instagram("flynt"));