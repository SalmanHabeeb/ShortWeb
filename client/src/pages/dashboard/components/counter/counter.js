import React from "react";
import "./counter.css";

function Counter({ count }) {
  return (
    <div
      className="counter"
      style={{ fontSize: count > 1000 ? `${60 - Math.log(count)}px` : "60px" }}
    >
      {count.toLocaleString()}
    </div>
  );
}

export default Counter;
