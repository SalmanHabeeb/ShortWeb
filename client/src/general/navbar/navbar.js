import React, { useEffect, useState } from "react";
import "./navbar.css";

import Title from "../title/title";
import { isLoggedIn } from "../utils/utils";

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

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  function handleHomeClick() {
    let searchLink = document.createElement("a");
    searchLink.href = "/";
    searchLink.click();
  }

  function handleSearchClick() {
    let searchLink = document.createElement("a");
    searchLink.href = "/search";
    searchLink.click();
  }

  function handleProfileClick() {
    let searchLink = document.createElement("a");
    searchLink.href = "/profile";
    searchLink.click();
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
          {loggedIn ? (
            <div
              className="navbar__url"
              onClick={() => {
                handleHomeClick();
              }}
            >
              Home
            </div>
          ) : null}
          {loggedIn ? (
            <div
              className="navbar__url"
              onClick={() => {
                handleSearchClick();
              }}
            >
              Search
            </div>
          ) : null}
          {loggedIn ? (
            <div
              className="navbar__url"
              onClick={() => {
                handleProfileClick();
              }}
            >
              Profile
            </div>
          ) : null}
          <button
            className="navbar__login-button"
            onClick={() => {
              document.getElementById("navbar-button").click();
            }}
          >
            {!loggedIn ? (
              <a id="navbar-button" href="/login">
                Login
              </a>
            ) : (
              <a id="navbar-button" href="/logout">
                Log Out
              </a>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
