import { check } from "k6";

const BASE_URL_API = __ENV.BASE_URL_API;
export const TeamAPI = async ({ http, user, authToken }) => {
  if (user?.email) {
    let [respon1, respon2] = await Promise.all([
      http.get(
        `${BASE_URL_API}/employees/levels?employeeIds=1,57,60,61,63,64,119,120,121,122,123,124,126,127,128,129,130,132,136,137,138,139,140,141,143,144,145,146,147,148,149,151,152,155,156,157,158,159,160,161,162,163,164,165,166,168,169,170,171,172,173,174,176,177,178,179,181,182,184,185,187,188,189,191,192,194,195,196,197,198,199,201,202,203,269,445,447,456,464,490&startDate=2024-01-01&endDate=2024-01-15`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
      http.get(
        `${BASE_URL_API}/employees/ids?employeeIds=1,57,60,61,63,64,119,120,121,122,123,124,126,127,128,129,130,132,136,137,138,139,140,141,143,144,145,146,147,148,149,151,152,155,156,157,158,159,160,161,162,163,164,165,166,168,169,170,171,172,173,174,176,177,178,179,181,182,184,185,187,188,189,191,192,194,195,196,197,198,199,201,202,203,269,445,447,456,464,490&startDate=2024-01-01&endDate=2024-01-15&employeeType=payroll&offset=0&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
    ]);

    check(respon1, {
      "Team respon1 loaded": (res) => res.status === 200,
    });

    check(respon2, {
      "Team respon2 loaded": (res) => res.status === 200,
    });
  }

  return {
    user,
  };
};
