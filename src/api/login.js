import { check } from "k6";

const BASE_URL_API = __ENV.BASE_URL_API;
const PASSWORD_API = __ENV.PASSWORD_API;

export const LoginAPI = async ({ http, user }) => {
  let authToken = null;
  if (user?.email) {
    let loginRes = await http.post(`${BASE_URL_API}/auth/login`, {
      email: user?.email,
      password: PASSWORD_API,
    });

    check(loginRes, {
      "login successful: ": (res) => `${res.status} - ${res.status === 201}`,
    });

    authToken = JSON.parse(loginRes?.body)?.accessToken;
  }

  return {
    user,
    authToken: authToken?.length > 0 ? authToken : null,
  };
};
