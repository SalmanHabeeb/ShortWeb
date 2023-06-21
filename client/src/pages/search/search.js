import React, { useState, useEffect, useRef } from "react";
import "./search.css";

import NavBar from "../../general/navbar/navbar";
import SearchResult from "./components/search-result/search-result";
import { getSearchResult, getSuggestions } from "../../lib";
import CircularSpinner from "../../general/circular-spinner/circular-spinner";

function SearchPage() {
  const [searchItem, setSearchItem] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [showSearchSuggestion, setShowSearchSuggestion] = useState(false);
  const [field, setField] = useState("full");

  const suggestBoxRef = useRef(null);
  const [suggestFocus, setSuggestFocus] = useState(null);

  const [searchResults, setSearchResults] = useState([]);

  // define a function that handles the outside click
  function handleOutsideClick(event) {
    // check if the click target is outside the element
    if (
      suggestBoxRef.current &&
      !suggestBoxRef.current.contains(event.target)
    ) {
      // do something when the outside click happens, such as closing the suggestions
      setShowSearchSuggestion(false);
      // console.log("Outside click");
    }
  }

  // use useEffect to add and remove the event listener for outside click
  useEffect(() => {
    // add the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);
    // return a cleanup function that removes the event listener when the component unmounts
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
          console.log(eleList[suggestFocus]);
          eleList[suggestFocus].focus();
        }
      }
    }
  }, [suggestFocus, suggestionList]);

  function handleFieldChange(e) {
    setField(e.target.value);
  }

  async function handleSearchTextChange(e) {
    setSearchItem(e.target.value);
    setShowSearchSuggestion(true);
    let suggestionData = await getSuggestions({
      query: e.target.value,
      field: field,
    });
    // console.log(suggestionData);
    setSuggestionList(suggestionData.data.suggestions);
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
    setSearchResults(searchResultData.data.suggestions);
    // console.log(searchResultData.data, searchResultData.error);
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
                console.log(suggestFocus);
                // Check if the key is Enter
                if (e.keyCode === 13) {
                  // Perform the search
                  handleSearch(searchItem);
                }
                // Check if the key is ArrowDown
                if (e.keyCode === 40) {
                  // Move the focus to the first suggestion
                  setSuggestFocus(0);
                }
              }}
              autoComplete="off"
            />
            <div className="search-suggestions" ref={suggestBoxRef}>
              {suggestionList.map((item, idx) => {
                // Split the item by the query
                const parts = item.split(new RegExp(`(${searchItem})`, "gi"));
                // console.log(parts);
                let limit = 37;
                if (window.matchMedia("(max-width: 600px)").matches) {
                  // If the screen is 600px or less, set the limit to 25
                  limit = 20;
                  // console.log("limit", limit);
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
                      // Check if the key is Enter
                      if (e.keyCode === 13) {
                        // Perform the search
                        handleSearch(item);
                      }
                      // Check if the key is ArrowDown
                      if (e.keyCode === 40) {
                        // Move the focus to the first suggestion
                        setSuggestFocus(idx + 1);
                      }
                      if (e.keyCode === 38) {
                        // Move the focus to the first suggestion
                        setSuggestFocus(idx - 1);
                      }
                    }}
                  >
                    {/* Loop through the parts and render them with different styles */}
                    {parts.map((part, i) => {
                      // Check if the part matches the query
                      const match =
                        searchItem &&
                        part.toLowerCase() === searchItem.toLowerCase();
                      // Return a span element with a highlight style if it matches, or plain text if it doesn't
                      return match ? (
                        <span
                          style={{ backgroundColor: "yellow", padding: "2px" }}
                        >
                          {part}
                        </span>
                      ) : (
                        <span>{part}</span>
                      );
                    })}
                  </div>
                );
              })}
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
          {/* Use a map function to render each search result as a component */}
          {searchResults.map((result) => (
            <SearchResult {...result} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
