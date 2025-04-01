import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";

const BASE_URL_WEB = __ENV.BASE_URL_WEB;

export const PageDashboard = async ({ page, user }) => {
  console.log(
    `++++  PageDashboard user: ${user?.email} ++++`,
    `page: ${BASE_URL_WEB}/page/dashboard`
  );

  if (user) {
    await page.goto(`${BASE_URL_WEB}/page/dashboard`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");

    // await page.waitForSelector("nav, header, .dashboard", { timeout: 10000 });

    await page.screenshot({
      path: `screenshots/dashboard/${__VU}/before-load.png`,
    });

    // ดึงเนื้อหาของหน้าเพื่อตรวจสอบว่ามี error หรือไม่ และมีข้อความที่คาดหวังหรือไม่
    const pageContent = await page.content();

    await check(null, {
      "ไม่มีข้อความ Error ในหน้า": () => !pageContent.includes("Error"),
      "โหลด Dashboard เรียบร้อย": () =>
        pageContent.includes("Dashboard") ||
        pageContent.includes("Expected Dashboard Text"),
    });
    await page.screenshot({
      path: `screenshots/dashboard/${__VU}/after-load.png`,
    });
  }

  return page;
};
