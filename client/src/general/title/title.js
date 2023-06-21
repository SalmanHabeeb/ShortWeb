import React from "react";
import "./title.css";

function Title() {
  return (
    <div
      className="title"
      onClick={() => {
        document.getElementById("link-to-home").click();
      }}
    >
      <span className="first">Short</span>
      <span className="second">Web</span>
      <a id="link-to-home" href="/"></a>
    </div>
  );
}

export default Title;
