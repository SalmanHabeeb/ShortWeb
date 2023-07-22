import React from "react";
import "./login-button.css";

function LoginButton({ loggedIn }) {
  return (
    <div className="login-button__container">
      <button
        className="navbar-login-button"
        onClick={() => {
          document.getElementById("login-button__link").click();
        }}
      >
        {loggedIn ? "Log Out" : "Login"}
      </button>
      {!loggedIn ? (
        <a id="login-button__link" style={{ display: "none" }} href="/login">
          Login
        </a>
      ) : (
        <a id="login-button__link" style={{ display: "none" }} href="/logout">
          Log Out
        </a>
      )}
    </div>
  );
}

export default LoginButton;
