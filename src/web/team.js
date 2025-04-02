import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";

const BASE_URL_WEB = __ENV.BASE_URL_WEB;

export const PageTeam = async ({ page, user }) => {
  console.log(
    `++++  PageTeam user: ${user?.email} ++++`,
    `page: ${BASE_URL_WEB}/page/teams`
  );

  if (user && [1, 2].includes(user.roleId)) {
    await page.goto(`${BASE_URL_WEB}/page/teams/admin/Digital Office/solutiondelivery/softwareengineering?ids=423,438,453,468,483,498,513`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");

    // await page.waitForSelector("nav, header, .dashboard", { timeout: 10000 });

    await page.screenshot({
      path: `screenshots/team/${__VU}/before-load.png`,
    });

    await check(page.locator("span.pl-8"), {
      header: async (lo) => (await lo.textContent()).trim() === "Teams",
    });

    await page.screenshot({
      path: `screenshots/team/${__VU}/after-load.png`,
    });
  }

  return page;
};
