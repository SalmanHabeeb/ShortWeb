import React, { useRef, useState, useEffect } from "react";
import "./home.css";
import { getShortenedURL } from "../../lib";
import Title from "../../general/title/title";

function HomePage() {
  const [ url, setUrl ] = useState("");
  // Use array destructuring to get urlObjects and setUrlObjects
  const [ urlObjects, setUrlObjects ] = useState([]);
  const urlContainer = useRef(false);
  const [ copied, setCopied ] = useState(-1);
  const timeoutId = useRef(null);

  useEffect(() => {
    return () => {
      // Clear the timeout if it exists
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  function handleCopyToClipboard(item, itemidx) {
      navigator.clipboard.writeText(item.shortened)
          .then(() => {
              setCopied(itemidx);
              timeoutId.current = setTimeout(() => {setCopied(-1)}, 3000);
          })
          .catch((error) => console.error(error))
  }

  function handleInValidResponse() {
      console.log("invalid response");
      alert("Invalid url");
  }

  function handleValidResponse(data) {
    urlContainer.current = true;
    setUrlObjects((prev) => [...prev, { url: url, shortened: data.shortUrl }]);
  }

  async function handleSubmit(e) {
    let response = await getShortenedURL(url);
    if (response.data.valid === false) {
      handleInValidResponse();
    } else {
      handleValidResponse(response.data);
    }
  }
  return (
    <div id="Home">
        <Title />
        <div className="url-container">
            <input
            className="url-input"
            type="text"
            placeholder="Enter your URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmit}>
                Squeeze
            </button>
        </div>
        <div className="data">
            {urlContainer.current? <div className="data-url">
                <div className="long-url">URL</div>
                <div className="short-url">Short URL</div>
            </div>:null}
            {urlContainer.current && urlObjects.map((item, idx) => (
                <div className="data-url" key={ item.shortened }>
                    <div className="long-url"><a href={ item.url }>{ item.url }</a></div>
                    <div className="short-url"><a href={ item.shortened } target="_blank" rel="noreferrer">{ item.shortened }</a></div>
                    <button 
                    className="copy-button"
                    onClick={() => handleCopyToClipboard(item, idx)}>
                        <i
                        className="material-icons"
                        style={(copied === idx)? { color: "green" }:null}>content_copy</i>
                    </button>
                    {(copied === idx)? <span>Copied!</span>:null}
                </div>
            ))}
        </div>
    </div>
  );
}

export default HomePage;