import React, { useState, useEffect, useRef } from "react";
import "./redirect.css";
import { getPath } from "./utils";
import { getMappedURL } from "../../lib";
import Title from "../../general/title/title";
import Cookies from "js-cookie";

function ReDirectPage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("Redirecting...");
  const [isSafe, setIsSafe] = useState(-1);
  const [virustotalScanLink, setVirustotalScanLink] = useState("/");
  const isCancelled = useRef(false);
  const [cancelButtonText, setCancelButtonText] = useState("Cancel");

  function handleError() {
    alert("Something has gone wrong. Please try again later.");
    handleInvalidUrl();
  }

  function handleInvalidUrl() {
    handleCancel("");
    setText("Invalid Url");
  }

  function handleRedirect(redirectUrl, isSafe = true) {
    localStorage.setItem(getPath(), redirectUrl);
    redirectToURL(redirectUrl);
  }

  function handleCancel(url2Cancel) {
    isCancelled.current = true;
    console.log(url2Cancel);
    setText("Will redirect to:");
    setCancelButtonText("Home");
  }

  function goToHome() {
    let link = document.createElement("a");
    link.href = "/";
    link.click();
  }

  function redirectToURL(url) {
    if (url !== "") {
      window.location.replace(url);
    }
  }

  function handleServerError() {
    alert("Server is facing difficulties. Please try again later.");
    handleInvalidUrl();
  }
  function handleUnSafeUrl(unSafeUrlData) {
    console.log(unSafeUrlData.url);
    setUrl(unSafeUrlData.url);
    handleCancel(unSafeUrlData.url);
    setIsSafe(0);
    setVirustotalScanLink(unSafeUrlData.virustotalScanLink);
  }

  async function onWindowLoad() {
    let data = localStorage.getItem(getPath());
    if (!data) {
      data = await getMappedURL({
        key: getPath(),
        token: Cookies.get("token"),
      });
      if (data.error) {
        handleError();
      } else {
        if (data.data.serverError) {
          handleServerError();
        } else if (data.data.isSafe === 0) {
          console.log(data.data);
          handleUnSafeUrl(data.data);
        } else if (data.data.urlNotExists) {
          handleInvalidUrl();
        } else {
          setIsSafe(data.data.isSafe);
          setVirustotalScanLink(data.data.virustotalScanLink);
          console.log(data.data.url);
          setUrl(data.data.url);
          setText("Redirecting to:");
          setTimeout(() => {
            if (!isCancelled.current) {
              handleRedirect(data.data.url);
            }
          }, 10000);
        }
      }
    } else {
      redirectToURL(data);
    }
  }

  // window.addEventListener
  //   ? window.addEventListener("load", onWindowLoad, false)
  //   : window.attachEvent && window.attachEvent("onload", onWindowLoad);
  useEffect(() => {
    onWindowLoad();
  }, []);

  return (
    <div id="Redirect">
      <div className="redirect__container">
        <Title />
        <div className="redirect-text-box">
          {text}&nbsp;
          <span
            className="redirect-text-box-link"
            onClick={() => {
              handleRedirect(url, isSafe);
            }}
          >
            {url}
          </span>
        </div>
        {url !== "" && isSafe !== -1 ? (
          <div className="redirect-safety-box">
            Above url was marked&nbsp;
            {isSafe === 1 ? (
              <a
                className="mark safe"
                href={virustotalScanLink}
                target="_blank"
                rel="noreferrer"
              >
                safe
              </a>
            ) : (
              <a
                className="mark unsafe"
                href={virustotalScanLink}
                target="_blank"
                rel="noreferrer"
              >
                malicious
              </a>
            )}
            &nbsp; by&nbsp;
            <a
              className="virustotal-link"
              href="https://www.virustotal.com/"
              target="_blank"
              rel="noreferrer"
            >
              VirusTotal
            </a>
          </div>
        ) : url !== "" && isSafe === -1 ? (
          <div className="redirect-safety-box">
            Check this url on{" "}
            <a
              className="virustotal-link"
              href={virustotalScanLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleCancel(url)}
            >
              VirusTotal
            </a>
          </div>
        ) : null}
        <div className="redirect-buttons">
          <button
            className="helper-button redirect-button"
            onClick={() => {
              handleRedirect(url, isSafe);
            }}
          >
            Redirect
          </button>
          <button
            className="helper-button cancel-button"
            onClick={() => {
              !isCancelled.current ? handleCancel(url) : goToHome();
            }}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReDirectPage;
