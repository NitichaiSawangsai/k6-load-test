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
  let page = await browser.newPage();
  try {
    const user = users[__VU % users.length]; // เลือกบัญชีจากลิสต์แบบสุ่ม
    if (!user) {
      console.error(`[VU-${__VU}] Error: User object is undefined.`);
      return;
    }

    page = await PageLogin({ page, user });
    page = await PageDashboard({ page, user });
  } catch (error) {
    console.error(`[VU-${__VU}] Error: ${error.message}`);
  } finally {
    await page?.close();
  }
}
