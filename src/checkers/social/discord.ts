import puppeteer from "puppeteer";
import { DiscordChecker } from "../../types/social/discord.js";
import { delay } from "../../core/delay.js";

const unavailable_strings = [
  "indisponível",
  "unavailable",
  "deve ter",
  "must be between",
];

const available_strings = ["disponível", "available"];

export async function discord(username: string, suggestions?: boolean | null): Promise<DiscordChecker> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1200,900",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    ],
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://discord.com/register", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector('input[name="username"]', { timeout: 20000 });

    await page.click('input[name="username"]', { clickCount: 3 });
    await delay();
    await page.type('input[name="username"]', username);
    await page.click('input[name="username"]', { clickCount: 3 });
    await delay(2000);

    await delay(8000);

    const possibleMessages = await page.$$('[class*="message"]');
    let text: string | undefined;
    let available: boolean | null = null;

    for (const msg of possibleMessages) {
      const content = (await page.evaluate((el) => el.textContent, msg))
        .trim()
        .toLowerCase();
      if (unavailable_strings.some((s) => content.includes(s))) {
        available = false;
        text = content;
        break;
      } else if (available_strings.some((s) => content.includes(s))) {
        available = true;
        text = content;
        break;
      }
    }

    await browser.close();

    return {
      platform: "discord",
      username,
      available,
      message: text,
    };
  } catch (err) {
    await browser.close();
    return {
      platform: "discord",
      username,
      available: null,
      message:
        err instanceof Error
          ? `Error: ${err.message}`
          : "Unknown error occurred",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
