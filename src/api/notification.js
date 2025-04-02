import { check } from "k6";

const BASE_URL_API = __ENV.BASE_URL_API;
export const NotificationAPI = async ({ http, user, authToken }) => {
  if (user?.email) {
    let [notiAll, notiUnread] = await Promise.all([
      http.post(
        `${BASE_URL_API}/notification,/all`,
        {
          page: 1,
          perPage: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
      http.post(
        `${BASE_URL_API}/notification/unread`,
        {
          page: 1,
          perPage: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ),
    ]);

    check(notiAll, {
      "Noti All loaded": (res) => res.status === 201,
    });

    check(notiUnread, {
      "Noti Unread loaded": (res) => res.status === 201,
    });
  }

  return {
    user,
  };
};
