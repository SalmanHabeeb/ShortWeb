import React, { useRef, useState, useEffect } from "react";
import "./home.css";
import { getShortenedURL, postNotes } from "../../lib";
import NavBar from "../../general/navbar/navbar";

import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import Cookies from "js-cookie";

function HomePage() {
  console.log(sessionStorage.getItem("isLoggedIn"));
  const [url, setUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const urlContainer = useRef(false);
  const [copied, setCopied] = useState(false);

  const [isSqueezing, setIsSqueezing] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [madeEdit, setMadeEdit] = useState(false);
  const timeoutId = useRef(null);
  const [notes, setNotes] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      let element = document.getElementById("home__url-input");
      element.focus();
    };
  }, []);

  useEffect(() => {
    setMadeEdit(true);
  }, [notes]);

  function handleCopyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        timeoutId.current = setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((error) => console.error(error));
  }

  function getPathFromURLString(url) {
    const parser = document.createElement("a");
    parser.href = url;
    return parser.pathname;
  }

  function handleAnalyse(shortUrl) {
    let goToLink = document.createElement("a");
    goToLink.href = "/analyse" + getPathFromURLString(shortUrl);
    goToLink.click();
  }

  function handleInValidResponse() {
    console.debug("invalid response");
    alert("Invalid url");
  }

  function handleValidResponse(data) {
    urlContainer.current = true;
    setLongUrl(url);
    setShortUrl(data.shortUrl);
    setNotes("");
  }

  async function handleSubmit(e) {
    setIsSqueezing(true);
    let response = await getShortenedURL({
      url: url,
      token: Cookies.get("token"),
    });
    if (response.error) {
      handleClientError();
    } else if (!response.data.shortUrl) {
      if (response.data.serverError) {
        handleServerError();
      } else if (response.data.valid === false) {
        handleInValidResponse();
      }
    } else {
      handleValidResponse(response.data);
    }
    setIsSqueezing(false);
  }

  function handleChangeNotes(e) {
    setNotes(e.target.value);
  }

  function handleClientError() {
    alert(
      "Something went wrong. Please check your internet connection and try again."
    );
  }

  function handleServerError() {
    alert("Something went wrong on our end. Please try again later.");
  }

  function handleNotAuthorized() {
    alert(
      "You are not authorized to save notes for this URL. Please login again."
    );
  }

  function handleUrlNotExists() {
    alert(
      "The URL you are trying to save notes for does not exist. Please check the URL and try again."
    );
  }

  async function handleClickSaveNotes() {
    setSavingNotes(true);
    if (madeEdit) {
      setMadeEdit(false);
      let data = await postNotes({
        shortUrl: shortUrl,
        notes: notes,
        token: Cookies.get("token"),
      });
      if (data.error) {
        handleClientError();
      } else if (data.data.success === false) {
        if (data.data.serverError) {
          handleServerError();
        } else if (data.data.notAuthorized) {
          handleNotAuthorized();
        } else if (data.data.urlNotExists) {
          handleUrlNotExists();
        } else {
          console.debug(data.data);
        }
      } else {
        setEditMode(!editMode);
      }
    } else {
      setEditMode(!editMode);
    }
    setSavingNotes(false);
  }

  function handleClickEdit(editMode, setEditMode) {
    setEditMode(!editMode);
  }

  return (
    <div id="HomePage">
      <NavBar />
      <div className="home-container">
        <div className="home__url-container">
          <input
            id="home__url-input"
            className="home__url-input"
            type="url"
            placeholder="Enter your URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSubmit();
              }
            }}
            autoComplete="off"
          />
          <button
            id="home__submit-button"
            className="home__submit-button"
            onClick={handleSubmit}
          >
            {isSqueezing ? (
              <CircularSpinner
                size="20px"
                thickness="3px"
                color="blue"
                bgColor="rgb(3, 170, 31)"
              />
            ) : (
              "Squeeze"
            )}
          </button>
        </div>
        <div className="data">
          {urlContainer.current ? (
            <div className="data-url">
              <div className="long-url">URL</div>
              <div className="short-url">Short URL</div>
            </div>
          ) : null}
          {urlContainer.current && (
            <div className="url_n_notes-container">
              <div className="data-url">
                <div className="long-url">
                  <a href={longUrl}>{longUrl}</a>
                </div>
                <div className="short-url">
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </div>
                <div className="copy-button-holder">
                  <button
                    className="copy-button"
                    onClick={() => handleCopyToClipboard(shortUrl)}
                  >
                    <i
                      className="material-icons"
                      style={copied ? { color: "green" } : null}
                    >
                      content_copy
                    </i>
                  </button>
                  {copied ? <span>Copied!</span> : null}
                </div>
                <button
                  className="analysis-button"
                  onClick={() => handleAnalyse(shortUrl)}
                >
                  <i className="material-icons">insert_chart</i>
                </button>
              </div>
              <div className="notes-box">
                {editMode ? (
                  <div className="notes-box__input-area">
                    <textarea
                      className="notes-box__input"
                      value={notes}
                      placeholder="Write Notes for Url"
                      maxLength={"100"}
                      onChange={handleChangeNotes}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          handleClickSaveNotes();
                        }
                      }}
                    ></textarea>
                    <span id="count" className="notes-box__input__span">
                      {notes.length}/100
                    </span>
                    <button
                      className="notes-box__save-button"
                      onClick={handleClickSaveNotes}
                    >
                      {savingNotes ? (
                        <CircularSpinner
                          size="20px"
                          thickness="3px"
                          color="blue"
                          bgColor="rgb(3, 170, 31)"
                        />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    className="notes-box__edit-button"
                    onClick={() => {
                      handleClickEdit(editMode, setEditMode);
                    }}
                  >
                    Edit Notes
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
