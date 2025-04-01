// import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";

const BASE_URL_WEB = __ENV.BASE_URL_WEB;

export const PageDashboard = async ({ page, user }) => {
  console.log(
    `++++  PageDashboard user: ${user?.email} ++++ `,
    `page: ${BASE_URL_WEB}/page/dashboard`
  );
  if (user) {
    await page.goto(`${BASE_URL_WEB}/page/dashboard`, {
      waitUntil: "networkidle", // รอให้ Network ไม่มี request ค้าง
      timeout: 6000000, 
    });
    await page.screenshot({
      path: `screenshots/dashboard/${__VU}/before-load.png`,
    });

    // await page.locator('.ant-select-selector').click();
    // // รอให้ตัวเลือกทั้งหมดปรากฏ
    // await page.waitForSelector('.ant-select-dropdown');
    // // เลือกทั้งหมด
    // const options = await page.locator('.ant-select-item-option').all();
    // for (const option of options) {
    //   await option.click();
    // }
    // // ตรวจสอบว่าเลือกครบแล้ว
    // const selectedItems = await page.locator('.ant-select-selection-item').count();
    // console.log(`Selected ${selectedItems} items`);
    // // ปิด dropdown
    // await page.locator('.ant-select-selector').click();

    // await page.screenshot({
    //     path: `screenshots/dashboard/${__VU}/select.png`,
    //   });
  }

  return page;
};
