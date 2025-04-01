import { browser } from "k6/browser";
import { PageLogin } from "./login.js";
import { PageDashboard } from "./dashboard.js";

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

const users = [
  { email: "nitichas@scg.com" }, // role admin
  { email: "iqbala@scg.com" }, // role Line Manager
  { email: "sawitsri@scg.com" }, // role Team Member
  { email: "sutachoc@scg.com" }, // role Lead
  { email: "kunanonp@scg.com" }, // role CDO
];

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
  } catch (error) {
  } finally {
    await page?.close();
    await context?.close();
  }
}
