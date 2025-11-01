import puppeteer from "puppeteer";
import { GithubChecker } from "../../types/social/github.js";
import { delay } from "../../core/delay.js";

export async function github(
  username: string,
  suggestions?: { enabled?: boolean; amount?: number; verification?: boolean }
): Promise<GithubChecker> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1200,900",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    ],
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://github.com/signup", { waitUntil: "networkidle2" });
    await page.waitForSelector("#login", { timeout: 10000 });

    await page.click("#login", { clickCount: 3 });
    await delay();
    await page.type("#login", username, { delay: 80 });
    await delay(1000, 1500);

    await page.click("#password", { delay: 200 });
    await delay(1000);

    await page.waitForFunction(
      `document.querySelector("auto-check.errored") || document.querySelector("auto-check.successed")`,
      { timeout: 10000 },
    );

    let available: boolean | null = null;
    let message: string | null = null;
    let usernames: string | null = null;

    const errorCheck = await page.$("auto-check.errored");
    const successCheck = await page.$("auto-check.successed");

    if (errorCheck) {
      available = false;

      const textEl = await page.$(".error .js-nux-conditionally-add-error");
      if (textEl)
        message = await page.evaluate((el: any) => el.innerText.trim(), textEl);

      if (suggestions?.enabled) {
        const suggestionsEl = await page.$(".js-suggested-usernames-container");
        if (suggestionsEl) {
          const suggestionText = await page.evaluate(
            (el: any) => el.innerText.trim(),
            suggestionsEl,
          );
          usernames = suggestionText;
        }
      }
    } else if (successCheck) {
      available = true;
      const successEl = await page.$(".success");
      if (successEl)
        message = (
          await page.evaluate((el) => el.textContent, successEl)
        ).trim();
    }

    await browser.close();

    return {
      platform: "github",
      username,
      available,
      suggestions: usernames,
      message,
    };
  } catch (err) {
    await browser.close();

    return {
      platform: "github",
      username,
      available: null,
      message:
        err instanceof Error
          ? `Error: ${err.message}`
          : "Unknown error occurred",
    };
  }
}
