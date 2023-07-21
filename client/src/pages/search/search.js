import React, { useState, useEffect, useRef } from "react";
import "./search.css";

import NavBar from "../../general/navbar/navbar";
import SearchResult from "./components/search-result/search-result";
import { getSearchResult, getSuggestions } from "../../lib";
import CircularSpinner from "../../general/circular-spinner/circular-spinner";
import Cookies from "js-cookie";

function SearchPage() {
  const [searchItem, setSearchItem] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [showSearchSuggestion, setShowSearchSuggestion] = useState(false);
  const [field, setField] = useState("full");

  const suggestBoxRef = useRef(null);
  const [suggestFocus, setSuggestFocus] = useState(null);

  const [searchResults, setSearchResults] = useState([]);

  function handleOutsideClick(event) {
    if (
      suggestBoxRef.current &&
      !suggestBoxRef.current.contains(event.target)
    ) {
      setShowSearchSuggestion(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (suggestFocus > suggestionList.length - 1 || suggestFocus < 0) {
      setSuggestFocus(null);
      let urlInput = document.getElementById("url-input");
      urlInput.setSelectionRange(urlInput.value.length, urlInput.value.length);
      urlInput.focus();
    } else {
      let eleList = document.getElementsByClassName("search-suggestion");
      if (eleList.length === 0) {
        setShowSearchSuggestion(true);
        setSuggestFocus(null);
        let urlInput = document.getElementById("url-input");
        urlInput.setSelectionRange(
          urlInput.value.length,
          urlInput.value.length
        );
        urlInput.focus();
      } else {
        if (suggestFocus !== null && suggestFocus >= 0) {
          eleList[suggestFocus].focus();
        }
      }
    }
  }, [suggestFocus, suggestionList]);

  function handleFieldChange(e) {
    setField(e.target.value);
    setShowSearchSuggestion(false);
    document.getElementById("url-input").focus();
  }

  async function handleSearchTextChange(e) {
    setSearchItem(e.target.value);
    setShowSearchSuggestion(true);
    let suggestionData = await getSuggestions({
      query: e.target.value,
      field: field,
    });
    setSuggestionList(suggestionData.data.suggestions);
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
    alert("You are not logged in. Try clearing the cookies and login again.");
  }

  function handleUserNotExists() {
    alert("You are not logged in. Try clearing the cookies and login again.");
  }

  async function handleSearch(searchText) {
    setSuggestionList([]);
    setSearchItem(searchText);
    setShowSearchSuggestion(false);
    setSearching(true);
    let searchResultData = await getSearchResult({
      query: searchText,
      field: field,
    });
    if (searchResultData.error) {
      handleClientError();
    } else if (searchResultData.data.serverError) {
      handleServerError();
    } else if (searchResultData.data.userNotExists) {
      handleUserNotExists();
    } else if (searchResultData.data.notAuthorized) {
      handleNotAuthorized();
    } else {
      setSearchResults(searchResultData.data.suggestions);
    }
    setSearching(false);
  }

  return (
    <div id="Search">
      <div className="search__container">
        <NavBar />
        <div className="search__url-container">
          <div className="search__url-input-container">
            <input
              id="url-input"
              className="search__url-input"
              type="text"
              placeholder="Search URL..."
              value={searchItem}
              onChange={(e) => {
                handleSearchTextChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchItem);
                }
                if (e.key === "ArrowDown") {
                  setSuggestFocus(0);
                }
              }}
              autoComplete="off"
            />
            <div className="search-suggestions" ref={suggestBoxRef}>
              {suggestionList !== []
                ? suggestionList.map((item, idx) => {
                    const parts = item.split(
                      new RegExp(
                        `(${searchItem
                          .replaceAll("\\", "")
                          .replaceAll("*", "")})`,
                        "gi"
                      )
                    );
                    let limit = 37;
                    if (window.matchMedia("(max-width: 600px)").matches) {
                      limit = 20;
                    }
                    if (parts[0].length >= limit) {
                      parts[0] = parts[0].slice(0, limit - 6);
                      parts[0] = parts[0] + "... ";
                    }
                    return (
                      <div
                        className={`${
                          showSearchSuggestion ? "search-suggestion" : "close"
                        }`}
                        tabIndex={0}
                        onClick={() => handleSearch(item)}
                        onKeyDown={(e) => {
                          console.log(suggestFocus);
                          if (e.key === "Enter") {
                            handleSearch(item);
                          }
                          if (e.key === "ArrowDown") {
                            setSuggestFocus(idx + 1);
                          }
                          if (e.key === "ArrowUp") {
                            setSuggestFocus(idx - 1);
                          }
                        }}
                      >
                        {parts.map((part, i) => {
                          const match =
                            searchItem &&
                            part.toLowerCase() === searchItem.toLowerCase();
                          return match ? (
                            <span
                              style={{
                                backgroundColor: "yellow",
                                padding: "2px",
                              }}
                            >
                              {part}
                            </span>
                          ) : (
                            <span>{part}</span>
                          );
                        })}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <button
            className="search-button"
            onClick={() => handleSearch(searchItem)}
          >
            {searching ? (
              <CircularSpinner
                size="20px"
                thickness="3px"
                color="blue"
                bgColor="#00ff00"
              />
            ) : (
              "Search"
            )}
          </button>
        </div>
        <div className="field-container">
          <input
            type="radio"
            className="field-input"
            id="full"
            name="field"
            value="full"
            checked={field === "full"}
            onClick={handleFieldChange}
          />
          <label
            htmlFor="full"
            className={`field-label field-label-${
              field === "full" ? "selected" : "unselected"
            }`}
          >
            Full Url
          </label>
          <input
            type="radio"
            className="field-input"
            id="short"
            name="field"
            value="short"
            checked={field === "short"}
            onClick={handleFieldChange}
          />
          <label
            htmlFor="short"
            className={`field-label field-label-${
              field === "short" ? "selected" : "unselected"
            }`}
          >
            Short Url
          </label>
          <input
            type="radio"
            className="field-input"
            id="notes"
            name="field"
            value="notes"
            checked={field === "notes"}
            onClick={handleFieldChange}
          />
          <label
            htmlFor="notes"
            className={`field-label field-label-${
              field === "notes" ? "selected" : "unselected"
            }`}
          >
            Notes
          </label>
        </div>
        <div className="search-results-container">
          {searchResults.map((result) => (
            <SearchResult {...result} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
