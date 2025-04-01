import { browser } from "k6/browser";
import { check, sleep } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";

const BASE_URL_WEB = __ENV.BASE_URL_WEB;
const PASSWORD_WEB = __ENV.PASSWORD_WEB;

export const options = {
  scenarios: {
    browser: {
      exec: "multiLoginTest",
      executor: "constant-vus",
      vus: 5, // จำนวนผู้ใช้พร้อมกัน
      duration: "40s",
      options: {
        browser: {
          type: "chromium",
          // headless: false,
        },
      },
    },
  },
};

const users = [
  { email: "eakaposi@scg.com", password: PASSWORD_WEB }, // role admin
  { email: "iqbala@scg.com", password: PASSWORD_WEB }, // role Line Manager
  { email: "sawitsri@scg.com", password: PASSWORD_WEB }, // role Team Member
  { email: "sutachoc@scg.com", password: PASSWORD_WEB }, // role Lead
  { email: "kunanonp@scg.com", password: PASSWORD_WEB }, // role CDO
];

export async function multiLoginTest() {
  const page = await browser.newPage();
  try {
    const user = users[__VU % users.length]; // เลือกบัญชีจากลิสต์แบบสุ่ม
    if (!user) {
      console.error(`[VU-${__VU}] Error: User object is undefined.`);
      return;
    }

    // start login
    await page.goto(`${BASE_URL_WEB}/auth/login`);
    await page.waitForLoadState("networkidle");
    await page.locator("input#username").type(user.email);
    await page.locator("input#password").type(user.password);
    console.log(`[VU-${__VU}] Attempting login with ${user.email}`);
    await page.screenshot({
      path: `screenshots/login/before-submit-${__VU}.png`,
    });
    await page.locator("button[type='submit']").click();

    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `screenshots/login/after-submit-${__VU}.png`,
    });

    await page
      .waitForSelector("nav, header, .dashboard", { timeout: 5000 })
      .catch(() => {
        console.log(`[VU-${__VU}] Warning: Element on home page not found`);
      });

    console.log(`[VU-${__VU}] Redirected to: ${page.url()}`);

    check(page, {
      "Login success and redirected to home": () =>
        page.url() === `${BASE_URL_WEB}/`,
    });

    await page.waitForLoadState("load"); // Wait until the page has fully loaded
    await page.screenshot({ path: `screenshots/home/after-load-${__VU}.png` });

    sleep(1);
    // end login
  } finally {
    await page.close();
  }
}
