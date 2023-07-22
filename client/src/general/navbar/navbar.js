import React, { useEffect, useState } from "react";
import "./navbar.css";

import Title from "../title/title";
import { isLoggedIn } from "../utils/utils";
import NavBarLink from "./components/navbar-link/navbar-link";
import LoginButton from "./components/login-button/login-button";

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function handleWindowLoad() {
      let result = await isLoggedIn();
      setLoggedIn(result);
    }
    handleWindowLoad();
  }, [loggedIn]);

  window.onresize = async () => {
    let w = window.outerWidth;
    let h = window.outerHeight;
    if (w > 800 && h > 400) {
      setShowMenu(false);
    }
  };

  function handleMenuClick() {
    let w = window.outerWidth;
    let h = window.outerHeight;
    if (w > 800 && h > 800) {
      setShowMenu(false);
    } else {
      setShowMenu(!showMenu);
    }
  }

  return (
    <div id="NavBar">
      <div className="navbar__container">
        <div className="navbar__logo-container">
          <div className="navbar__logo">
            <Title />
          </div>
          <button
            className="navbar__logo-container__menu-btn"
            onClick={handleMenuClick}
          >
            <i className="material-icons">menu</i>
          </button>
        </div>
        <div className={showMenu ? "navbar__show_urls" : "navbar__urls"}>
          <NavBarLink loggedIn={loggedIn} linkText={"Home"} link={"/"} />
          <NavBarLink
            loggedIn={loggedIn}
            linkText={"Search"}
            link={"/search"}
          />
          <NavBarLink
            loggedIn={loggedIn}
            linkText={"Profile"}
            link={"/profile"}
          />
          <LoginButton loggedIn={loggedIn} />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
