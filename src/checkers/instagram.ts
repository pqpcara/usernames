import puppeteer from "puppeteer";

interface CheckResult {
  platform: string;
  username: string;
  available: boolean | null;
  message: string | null;
  suggestions?: string | null;
}

const selectors = {
  validIcon:
    "span.xo3uz88.x1twbzvy.xiy17q3.x17rw0jw.x17z2i9w.xnsbi7g.x1quspbi.xermsev.x972fbf.x10w94by.x1qhh985.x14e42zd.xjb2p0i.xk390pu.xdj266r.x14z9mp.xat24cr.x13fj5qh.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x11njtxf",
  invalidIcon:
    "span.xo3uz88.x1nxxyus.xiy17q3.x17rw0jw.x17z2i9w.xnsbi7g.x1mb7f8p.xermsev.x972fbf.x10w94by.x1qhh985.x14e42zd.xjb2p0i.xk390pu.xdj266r.x14z9mp.xat24cr.x13fj5qh.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x11njtxf",
  errorMsg:
    "div.x1qjc9v5.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.xxk16z8.x78zum5.xdt5ytf.x2lah0s.x1fhwpqd.x1gslohp.x14z9mp.xat24cr.x13fj5qh.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x11njtxf",
};

function delay(min = 500, max = 1500) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min),
  );
}

export async function instagram(username: string): Promise<CheckResult> {
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
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );
    await page.goto("https://www.instagram.com/accounts/emailsignup/", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector('input[name="username"]', { timeout: 15000 });

    const input = await page.$('input[name="username"]');
    if (!input) throw new Error("Username input not found");

    await input.click({ clickCount: 3 });
    await delay(100, 200);
    await page.keyboard.press("Backspace");
    await delay(100, 200);
    await input.type(username, { delay: 50 });
    await page.keyboard.press("Enter");
    await delay(600, 1000);

    await page
      .waitForFunction(
        (valid, invalid, error) =>
          !!document.querySelector(valid) ||
          !!document.querySelector(invalid) ||
          !!document.querySelector(error) ||
          document
            .querySelector('input[name="username"]')
            ?.getAttribute("aria-describedby")
            ?.includes("ssfErrorAlert"),
        { timeout: 5000 },
        selectors.validIcon,
        selectors.invalidIcon,
        selectors.errorMsg,
      )
      .catch(() => {});

    const state = await page.evaluate(
      (valid, invalid, error) => {
        const input = document.querySelector<HTMLInputElement>(
          'input[name="username"]',
        );
        return {
          hasValidIcon: !!document.querySelector(valid),
          hasInvalidIcon: !!document.querySelector(invalid),
          ariaInvalid: input
            ?.getAttribute("aria-describedby")
            ?.includes("ssfErrorAlert"),
          errorMessage:
            document.querySelector(error)?.textContent?.trim() || null,
        };
      },
      selectors.validIcon,
      selectors.invalidIcon,
      selectors.errorMsg,
    );

    await browser.close();

    if (state.hasInvalidIcon || state.ariaInvalid)
      return {
        platform: "instagram",
        username,
        available: false,
        message:
          state.errorMessage ||
          "This username is not available. Please try another.",
      };

    if (
      state.errorMessage &&
      /username.*not available/i.test(state.errorMessage)
    )
      return {
        platform: "instagram",
        username,
        available: false,
        message: state.errorMessage,
      };

    if (state.hasValidIcon)
      return {
        platform: "instagram",
        username,
        available: true,
        message: "Username is available",
      };

    return {
      platform: "instagram",
      username,
      available: null,
      message: "Could not determine username availability",
    };
  } catch (error) {
    await browser.close();
    return {
      platform: "instagram",
      username,
      available: null,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
