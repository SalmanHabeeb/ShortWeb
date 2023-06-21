import axios from "axios";

const isLocalHost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/ //@EXAMPLE: hostname=192.168.1.4:3000
    )
);

const API_URL = isLocalHost
  ? process.env.REACT_APP_LOCAL_SERVER_API
  : process.env.REACT_APP_REMOTE_SERVER_API;

export const Axios = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});
