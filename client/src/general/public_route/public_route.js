import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = () => {
  // Fetching the user from the user context.
  // on the client side, use Cookies.get() to get the cookie value
  let user;
  let redirectHomeUrl = "/";
  const token = Cookies.get("isLoggedIn");
  // check if the token is defined
  if (token) {
    user = true;
  } else {
    user = false;
  }

  // If the user is not logged in we are redirecting them
  // to the login page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return user ? <Navigate to={redirectHomeUrl} /> : <Outlet />;
};

export default PublicRoute;
