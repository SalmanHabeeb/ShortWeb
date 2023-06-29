import React, { useState, useEffect } from "react";
import "./logout.css";

import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import { sendLogOutRequest } from "../../lib";
import { isLoggedIn } from "../../general/utils/utils";
import Cookies from "js-cookie";

function handleServerError() {
  if (isLoggedIn()) {
    alert("Server is currently facing difficulties. Please try again later");
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
    let data = await sendLogOutRequest({ token: Cookies.get("token") });
    if (data.data.serverError) {
      handleServerError();
    } else {
      sessionStorage.removeItem("isLoggedIn");
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
