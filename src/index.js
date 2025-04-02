import { browser } from "k6/browser";
import http from "k6/http";
import { PageLogin } from "./web/login.js";
import { PageDashboard } from "./web/dashboard.js";
import { PageTeam } from "./web/team.js";
import { LoginAPI } from "./api/login.js";
import { NotificationAPI } from "./api/notification.js";
import { DashboardAPI } from "./api/dashboard.js";
import { TeamAPI } from "./api/team.js";
import { users } from "./../secrets/user.js";

export const options = {
  scenarios: {
    load: {
      exec: "checkBackend",
      executor: "ramping-vus",
      stages: [
        { duration: "5s", target: 5 },
        { duration: "10s", target: 5 },
        { duration: "5s", target: 0 },
      ],
      // startTime: "10s",
    },
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

export async function checkBackend() {
  const user = users[__VU % users.length];
  if (!user) {
    return;
  }
  const { authToken } = await LoginAPI({ http, user });
  await NotificationAPI({ http, user, authToken });
  await DashboardAPI({ http, user, authToken });
  await TeamAPI({ http, user, authToken })
}

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
    page = await PageTeam({ page, user });
  } finally {
    await page?.close();
    await context?.close();
  }
}
