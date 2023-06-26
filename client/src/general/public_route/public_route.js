import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = () => {
  let user;
  let redirectHomeUrl = "/";

  if (Cookies.get("isLoggedIn")) {
    user = true;
  } else {
    user = false;
  }

  // If the user is logged in we are redirecting them
  // to the home page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return user ? <Navigate to={redirectHomeUrl} /> : <Outlet />;
};

export default PublicRoute;
