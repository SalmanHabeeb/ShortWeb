import React, { useState, useEffect, useRef } from "react";
import './redirect.css';
import { getPath } from "./utils";
import { getMappedURL } from "../../lib";
import Title from "../../general/title/title";

function ReDirectPage() {
    const [ url, setUrl ] = useState("");
    const [ text, setText ] = useState("Redirecting...");
    const isCancelled = useRef(false);
    const [ cancelButtonText, setCancelButtonText ] = useState("Cancel");

    function handleError() {
        setText("Invalid url");
    }

    function handleRedirect() {
        redirectToURL(url);
    }

    function handleCancel() {
        isCancelled.current = true;
        setText("The url is: " + url);
        setCancelButtonText("Home");
    }

    function goToHome() {
        let link = document.createElement('a');
        link.href = "/";
        link.click();
    }

    function redirectToURL(url) {
        console.log(url);
        if(url !== "") {
            window.location.replace(url);
        }
    }

    useEffect(() => {
        async function handleLoadPage() {
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
    
        handleLoadPage();
      }, []);

    return (
        <div id="Redirect">
            <Title />
            <div className="redirect-text-box"> { text } </div>
            <div className="redirect-buttons">
                <button className="helper-button redirect-button" onClick={ handleRedirect }>Redirect</button>
                <button className="helper-button cancel-button" onClick={ !isCancelled.current? handleCancel:goToHome }>{ cancelButtonText }</button>
            </div>
        </div>
    )
}

export default ReDirectPage;