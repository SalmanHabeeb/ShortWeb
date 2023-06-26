import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./login.css";
import Title from "../../general/title/title";
import { makeLoginPostRequest } from "../../lib";
import CircularSpinner from "../../general/circular-spinner/circular-spinner";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleLoginError() {
    alert("Something went wrong. Please try again later.");
  }

  function handleInvalidEmail() {
    alert("This email is not valid. Please enter a valid email address.");
  }

  function handleInvalidPassword() {
    alert("This password is not valid. Please enter the correct password.");
  }

  function handleUserNotExists() {
    alert(
      "This email is not registered. Please sign up or use a different email."
    );
  }

  function handleServerError() {
    alert("Server is experiencing difficulties. Please try again later.");
  }

  async function handleSubmit(email, password) {
    setLoggingIn(true);
    let data = await makeLoginPostRequest({
      email: email,
      password: password,
    });
    console.log(data);
    if (data.error) {
      handleLoginError();
    } else if (data.data.isLoggedIn === null) {
      if (data.data.invalidEmail) {
        handleInvalidEmail();
      } else if (data.data.invalidPassword) {
        handleInvalidPassword();
      } else if (data.data.userNotExists) {
        handleUserNotExists();
      } else if (data.data.serverError) {
        handleServerError();
      } else {
        console.log(data.data);
      }
    } else {
      console.log(data.data.isLoggedIn);
      Cookies.set("isLoggedIn", data.data.isLoggedIn, { sameSite: "Strict" });
      Cookies.set("token", data.data.token, {
        sameSite: "Strict",
        expires: 30,
      });
      sessionStorage.setItem("isLoggedIn", data.data.isLoggedIn);
      let homeLink = document.createElement("a");
      homeLink.href = "/landingPage";
      homeLink.click();
    }
    setLoggingIn(false);
  }

  useEffect(() => {
    let email = document.getElementById("email");
    email.focus();
  }, []);

  return (
    <div id="Login">
      <div className="login__container">
        <div className="login__form">
          <Title />
          <div className="login__input">
            <label htmlFor="email" className="login__input__label">
              Email
            </label>
            <input
              id="email"
              className="login__input__field"
              value={email}
              type="email"
              required
              onChange={handleEmailChange}
              title="Enter a valid email"
            />
          </div>
          <div className="login__input">
            <label htmlFor="password" className="login__input__label">
              Password
            </label>
            <input
              id="password"
              className="login__input__field"
              value={password}
              type="password"
              required
              onChange={handlePasswordChange}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSubmit(email, password);
                }
              }}
            />
          </div>
          <div className="login-button-container">
            <button
              className="login-button"
              type="none"
              onClick={() => {
                handleSubmit(email, password);
              }}
            >
              {loggingIn ? (
                <CircularSpinner
                  size="20px"
                  thickness="3px"
                  color="blue"
                  bgColor="#00ff00"
                />
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="signup-link-container">
            Don't have an account?
            <a className="signup-link" href="/signup">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
