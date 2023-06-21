import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  // Fetching the user from the user context.
  let user;
  if (Cookies.get("isLoggedIn")) {
    user = true;
  } else {
    user = false;
  }
  const redirectLoginUrl = `/landingPage`;

  // If the user is not logged in we are redirecting them
  // to the login page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return !user ? <Navigate to={redirectLoginUrl} /> : <Outlet />;
};

export default PrivateRoute;
