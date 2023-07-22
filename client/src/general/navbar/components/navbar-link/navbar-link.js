import React from "react";
import "./navbar-link.css";

function NavBarLink({ loggedIn, linkText, link }) {
  let linkId = `navbar-link-${linkText.toLowerCase()}`;
  const handleLabelClick = () => {
    const linkElement = document.getElementById(linkId);
    linkElement.click();
  };
  return (
    <div className="navbar-link__container">
      {loggedIn ? (
        <div className="navbar-link__url" onClick={handleLabelClick}>
          {linkText}
        </div>
      ) : null}
      <a id={linkId} style={{ display: "none" }} href={link}>
        {linkText}
      </a>
    </div>
  );
}

export default NavBarLink;
