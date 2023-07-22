import React, { useState, useEffect } from "react";
import "./signup.css";
import Title from "../../general/title/title";
import { makeSignUpPostRequest } from "../../lib";
import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import Cookies from "js-cookie";

import * as errorMessages from "../../general/utils/error_messages";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  console.log(Cookies.get("token"));

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleClientError() {
    errorMessages.displayClientErrorMessage();
  }
  function handleUserExists() {
    errorMessages.displayUserExistsMessage();
  }
  function handleInvalidEmail() {
    errorMessages.displayInvalidEmailMessage();
  }
  function handleInvalidPassword() {
    errorMessages.displayInvalidNewPasswordMessage();
  }
  function handleServerError() {
    errorMessages.displayServerErrorMessage();
  }
  async function handleSignUp(e) {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;
    setSigningIn(true);
    let data = await makeSignUpPostRequest({
      email: email,
      password: password,
    });
    if (data.error) {
      handleClientError();
    } else if (data.data.isLoggedIn === null) {
      if (data.data.userExists) {
        handleUserExists();
      } else if (data.data.invalidEmail) {
        handleInvalidEmail();
      } else if (data.data.invalidPassword) {
        handleInvalidPassword();
      } else if (data.data.serverError) {
        handleServerError();
      } else {
        console.log(data.data);
      }
    } else {
      console.log(data.data.isLoggedIn);
      Cookies.set("isLoggedIn", data.data.isLoggedIn);
      Cookies.set("token", data.data.token, {
        expires: 30,
      });
      sessionStorage.setItem("isLoggedIn", "true");
      let homeLink = document.createElement("a");
      homeLink.href = "/landingPage";
      homeLink.click();
    }
    setSigningIn(false);
  }

  useEffect(() => {
    let email = document.getElementById("email");
    email.focus();
  }, []);

  return (
    <div id="signup">
      <div className="signup__container">
        <form className="signup__form" onSubmit={(e) => handleSignUp(e)}>
          <Title />
          <div className="signup__input">
            <label htmlFor="email" className="signup__input__label">
              Email
            </label>
            <input
              id="email"
              className="signup__input__field"
              value={email}
              type="email"
              required
              onChange={handleEmailChange}
              autoComplete="on"
            />
          </div>
          <div className="signup__input">
            <label htmlFor="password" className="signup__input__label">
              Password
            </label>
            <input
              id="password"
              className="signup__input__field"
              value={password}
              type="password"
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$"
              title="The password should contain atleast one smallcase and uppercase alphabet, and a digit, and should be of length 8 to 16 characters"
              onChange={handlePasswordChange}
              autoComplete="on"
            />
          </div>
          <div className="signup-button-container">
            <button className="signup-button" type="submit">
              {signingIn ? (
                <CircularSpinner
                  size="20px"
                  thickness="3px"
                  color="blue"
                  bgColor="#00ff00"
                />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <div className="login-link-container">
            Already registered?
            <a className="login-link" href="/login">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
