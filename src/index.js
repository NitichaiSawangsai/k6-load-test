import { browser } from "k6/browser";
import { PageLogin } from "./login.js";
import { PageDashboard } from "./dashboard.js";
import { users } from "./../secrets/user.js";

export const options = {
  scenarios: {
    browser: {
      exec: "checkFrontend",
      executor: "constant-vus",
      vus: 5, // จำนวนผู้ใช้พร้อมกัน
      duration: "220s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export async function checkFrontend() {
  const context = await browser.newContext();
  let page = await context.newPage();
  try {
    const user = users[__VU % users.length]; // เลือกบัญชีจากลิสต์แบบสุ่ม
    if (!user) {
      return;
    }

    page = await PageLogin({ page, user });
    page = await PageDashboard({ page, user });
  } finally {
    await page?.close();
    await context?.close();
  }
}
