import { check } from "k6";

const BASE_URL_API = __ENV.BASE_URL_API;
export const DashboardAPI = async ({ http, user, authToken }) => {
  if (user?.email && [1].includes(user.roleId)) {
    let [repon1, repon2] = await Promise.all([
      http.post(
        `${BASE_URL_API}/dashboard/info`,
        {
          "years[]": ["2025"],
          "months[]": ["January"],
          "periods[]": ["1-15", "16-31"],
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
      http.post(
        `${BASE_URL_API}/dashboard/team-members-worklogs`,
        {
          "years[]": [2025],
          "months[]": ["January"],
          "periods[]": ["1-15", "16-31"],
          page: 1,
          perPage: 5,
          utilizationSorting: "desc",
          nameSortingDirection: "asc",
          percentWork: [],
          companys: [],
          departments: [],
          sections: [],
          workingHourSorting: "desc",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
    ]);


    check(repon1, {
      "Dashboard info loaded": (res) => res.status === 201,
    });

    check(repon2, {
      "Dashboard Team Members Worklog loaded": (res) => res.status === 201,
    });
  }

  return {
    user,
  };
};
