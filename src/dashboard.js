const BASE_URL_WEB = __ENV.BASE_URL_WEB;

export const PageDashboard = async ({ page, user }) => {
  console.log(
    `++++  PageDashboard user: ${user?.email} ++++ `,
    `page: ${BASE_URL_WEB}/page/dashboard`
  );

  if (user) {
    await page.goto(`${BASE_URL_WEB}/page/dashboard`, {
      waitUntil: "networkidle", // รอให้ Network ไม่มี request ค้าง
      timeout: 60000, // ตั้ง timeout ให้เหมาะสม (60s)
    });

    // รอให้โหลดทุกอย่างเสร็จสมบูรณ์
    await page.waitForLoadState("networkidle");

    await page.waitForLoadState("load"); 

    await page.screenshot({
      path: `screenshots/dashboard/${__VU}/before-load.png`,
    });
  }

  return page;
};
