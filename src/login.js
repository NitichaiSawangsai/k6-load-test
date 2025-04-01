import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";

const BASE_URL_WEB = __ENV.BASE_URL_WEB;
const PASSWORD_WEB = __ENV.PASSWORD_WEB;

export const PageLogin = async ({ page, users, user }) => {
  console.log(`++++  PageLogin user: ${user?.email} ++++`);
  if (user) {
    await page.goto(`${BASE_URL_WEB}/auth/login`);
    await page.waitForLoadState("networkidle");
    await page.locator("input#username").type(user.email);
    await page.locator("input#password").type(PASSWORD_WEB);
    await page.screenshot({
      path: `screenshots/login/before-submit-${__VU}.png`,
    });
    await page.locator("button[type='submit']").click();

    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `screenshots/login/after-submit-${__VU}.png`,
    });

    await page
      .waitForSelector("nav,header,.dashboard", {
        timeout: 5000,
      })
      .catch(() => {});

    console.log(`[VU-${__VU}] ${user?.email} Redirected to: ${page.url()}`);

    check(page, {
      "Login success and redirected to home": () => {
        if (!page) {
          return false;
        }
        return page.url().indexOf("/page") > -1;
      },
    });

    await page.waitForLoadState("load"); // Wait until the page has fully loaded
    await page.screenshot({ path: `screenshots/home/after-load-${__VU}.png` });
  }


  return page;
};
