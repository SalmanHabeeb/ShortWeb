import React, { useState, useEffect } from "react";
import "./signup.css";
import Title from "../../general/title/title";
import { makeSignUpPostRequest } from "../../lib";
import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import Cookies from "js-cookie";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  console.log(Cookies.get("token"));

  function getEmailPattern() {
    return "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSignUpError() {
    alert("Something went wrong. Please try again later.");
  }
  function handleUserExists() {
    alert(
      "This email is already registered. Please log in or use a different email."
    );
  }
  function handleInvalidPassword() {
    alert(
      "This password is not valid. Please enter a password that has at least 8 characters, one uppercase letter, one lowercase letter and one number."
    );
  }
  function handleInvalidEmail() {
    alert("This email is not valid. Please enter a valid email address.");
  }
  function handleInvalidPassword() {
    alert(
      "This password is not valid. Please enter a password that has at least 8 characters, one uppercase letter, one lowercase letter and one number."
    );
  }
  function handleServerError() {
    alert("Server is experiencing difficulties. Please try again later.");
  }
  async function handleSignUp() {
    setSigningIn(true);
    let data = await makeSignUpPostRequest({
      email: email,
      password: password,
    });
    console.log(data);
    if (data.error) {
      handleSignUpError();
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
        sameSite: "None",
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
        <div className="signup__form">
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
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$"
              title="The password should contain atleast one smallcase and uppercase alphabet, digit and a special character, and should be of length 8 to 16 characters"
              onChange={handlePasswordChange}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSignUp(email, password);
                }
              }}
              autoComplete="on"
            />
          </div>
          <div className="signup-button-container">
            <button
              className="signup-button"
              type="none"
              onClick={() => {
                handleSignUp(email, password);
              }}
            >
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
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
