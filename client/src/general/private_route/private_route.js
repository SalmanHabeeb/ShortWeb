import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/utils";

const PrivateRoute = () => {
  let user;
  if (isLoggedIn()) {
    user = true;
  } else {
    user = false;
  }
  const redirectLandingUrl = `/landingPage`;

  // If the user is not logged in we are redirecting them
  // to the login page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return !user ? <Navigate to={redirectLandingUrl} /> : <Outlet />;
};

export default PrivateRoute;
