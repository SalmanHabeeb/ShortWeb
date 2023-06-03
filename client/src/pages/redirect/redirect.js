import React, { useState, useEffect, useRef } from "react";
import './redirect.css';
import { getPath } from "./utils";
import { getMappedURL } from "../../lib";

function ReDirectPage() {
    const [ url, setUrl ] = useState("");
    const [ text, setText ] = useState("Redirecting...");
    const isCancelled = useRef(false);

    function handleError() {
        setText("Invalid url");
    }

    function handleRedirect() {
        redirectToURL(url);
    }

    function handleCancel() {
        isCancelled.current = true;
        setText("The url is: " + url);
    }

    function redirectToURL(url) {
        console.log(url);
        if(url !== "") {
            window.location.replace(url);
        }
    }

    useEffect(() => {
        async function fetchData() {
          let data = await getMappedURL(getPath());
          if (data.error) {
            handleError();
          } else {
            console.log(data.data.url);
            setUrl(data.data.url);
            setText("Redirecting to " + data.data.url);
            setTimeout(() => {
                if(!isCancelled.current) {
                    redirectToURL(data.data.url);

                }
            }, 10000);
          }
        }
    
        fetchData();


      }, []);
    return (
        <div id="Redirect">
            <div className="redirect-text-box"> { text } </div>
                <div className="redirect-buttons">
                    <button className="helper-button redirect-button" onClick={handleRedirect}>Redirect</button>
                    <button className="helper-button cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
    )
}

export default ReDirectPage;