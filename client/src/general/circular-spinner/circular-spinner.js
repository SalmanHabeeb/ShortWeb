import React from "react";
import "./circular-spinner.css";

function CircularSpinner({
  size = "50px",
  thickness = "10px",
  color = "#383636",
  bgColor = "#f3f3f3",
  contSize = "fit-content",
}) {
  return (
    <div
      className="spinner-container"
      style={{ width: contSize, height: contSize }}
    >
      <div
        className="loading-spinner"
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
          borderColor: bgColor,
          borderTopColor: color,
        }}
      ></div>
    </div>
  );
}

export default CircularSpinner;
