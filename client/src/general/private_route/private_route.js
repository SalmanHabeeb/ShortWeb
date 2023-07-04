import { useState, useEffect } from "react";
import "./private_route.css";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/utils";

import CircularSpinner from "../circular-spinner/circular-spinner";

const PrivateRoute = () => {
  const [user, setUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  const TIMEOUT_DURATION = 1000;
  let timeoutId;
  useEffect(() => {
    async function onWindowLoad() {
      let user = await isLoggedIn();
      setIsLoading(false);
      setUser(user);
    }
    onWindowLoad();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  timeoutId = setTimeout(() => {
    setShowSpinner(true);
  }, TIMEOUT_DURATION);
  const redirectLandingUrl = `/landingPage`;

  // If the user is not logged in we are redirecting them
  // to the login page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return isLoading ? (
    <div id="PrivateRoute">
      <div className="private-route__container">
        {showSpinner ? (
          <CircularSpinner
            color="rgb(28, 67, 240)"
            bgColor="white"
            contSize="160px"
          />
        ) : null}
      </div>
    </div>
  ) : !user ? (
    <Navigate to={redirectLandingUrl} />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
