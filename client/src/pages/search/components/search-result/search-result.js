import React from "react";
import { Link } from "react-router-dom";
import "./search-result.css";
import moment from "moment";

function SearchResult({ short, full, notes, createdAt }) {
  return (
    <div className="search-result">
      <div className="search-result-info">
        <p className="search-result-short">
          <a href={`/${short}`} target="_blank" rel="noreferrer">
            {short}
          </a>
        </p>
        <p className="search-result-full">
          <a href={full} target="_blank" rel="noreferrer">
            {full}
          </a>
        </p>
        <p className="search-result-notes">{notes}</p>
        <p className="search-result-date">
          {moment(createdAt).local().format("MM/DD/YYYY, h:mm:ss A")}
        </p>
      </div>
      <div className="search-result-action">
        <a href={`/analyse/${short}`} target="_blank" rel="noreferrer">
          <button className="material-icons">insert_chart</button>
        </a>
      </div>
    </div>
  );
}

export default SearchResult;
