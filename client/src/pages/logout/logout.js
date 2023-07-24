import React, { useState, useEffect } from "react";
import "./logout.css";

import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import { sendLogOutRequest } from "../../lib";
import { isLoggedIn } from "../../general/utils/utils";
import Cookies from "js-cookie";

import * as errorMessages from "../../general/utils/error_messages";

function handleServerError() {
  if (isLoggedIn()) {
    errorMessages.displayServerErrorMessage();
  } else {
    sessionStorage.removeItem("isLoggedIn");
    let logoutLink = document.createElement("a");
    logoutLink.href = "/landingPage";
    logoutLink.click();
  }
}
function LogOutPage() {
  const [loggingOut, setLoggingOut] = useState(true);

  async function handleLogOut() {
    sessionStorage.removeItem("isLoggedIn");
    let data = await sendLogOutRequest({});
    if (data.error) {
      errorMessages.displayClientErrorMessage();
    } else if (data.data.serverError) {
      handleServerError();
    } else {
      sessionStorage.clear();
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("isLoggedIn");
      let logoutLink = document.createElement("a");
      logoutLink.href = "/landingPage";
      logoutLink.click();
    }
    setLoggingOut(false);
  }
  useEffect(() => {
    handleLogOut();
  }, []);
  return (
    <div id="Logout">
      <div className="logout-container">
        {loggingOut ? (
          <CircularSpinner
            color="rgb(28, 67, 240)"
            bgColor="white"
            contSize="160px"
          />
        ) : null}
      </div>
    </div>
  );
}

export default LogOutPage;
