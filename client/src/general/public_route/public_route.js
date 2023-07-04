import React, { useEffect, useState } from "react";
import "./public_route.css";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/utils";

import CircularSpinner from "../circular-spinner/circular-spinner";

const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  let redirectHomeUrl = "/";
  let timeoutId;
  const TIMEOUT_DURATION = 1000;

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

  // If the user is logged in we are redirecting them
  // to the home page. Otherwise we are letting them to
  // continue to the page as per the URL using <Outlet />.
  return isLoading ? (
    <div id="PublicRoute">
      <div className="public-route__container">
        {showSpinner ? (
          <CircularSpinner
            color="rgb(28, 67, 240)"
            bgColor="white"
            contSize="160px"
          />
        ) : null}
      </div>
    </div>
  ) : user ? (
    <Navigate to={redirectHomeUrl} />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
