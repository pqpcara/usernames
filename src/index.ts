import { Client } from "./core/client.js";

const client = new Client();

async function main() {
  console.log(await client.github("pqpcara"));
}

main();

export { Client };
