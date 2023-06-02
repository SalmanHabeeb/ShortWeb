import React, { useState } from "react";
import "./home.css";
import { getShortenedURL } from "../../lib";

function HomePage() {
    const [url, setUrl] = useState("");

    async function handleSubmit(e) {
        let response = await getShortenedURL(url);
        console.log(response);
    }
    return(
        <div id="Home">
            <input
            className="url-input"
            type="text"
            placeholder="Enter your URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)} />
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default HomePage;