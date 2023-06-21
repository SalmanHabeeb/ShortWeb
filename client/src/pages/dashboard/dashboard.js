import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Title from "../../general/title/title";
import Counter from "./components/counter/counter";
import socketIO from "socket.io-client";
import NavBar from "../../general/navbar/navbar";
import { getUrlData } from "../../lib";

function DashBoard() {
  const socket = socketIO.connect("http://localhost:5000", {
    transports: ["websocket"],
  });
  socket.on("disconnect", (err) => console.log(err));
  socket.on("connect_error", (err) => console.error(err));
  socket.on("connect_failed", (err) => console.error(err));
  const [count, setCount] = useState(0);
  let path = window.location.pathname.slice(1);
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("getData", path);
      console.log("Done");
    }, 10000);

    socket.on("data", (data) => {
      setCount(data.clicks);
      console.log(data);
    });
  }, [socket, path]);

  return (
    <div id="DashBoard">
      <div className="dashboard-container">
        <NavBar />
        <div className="dashboard">
          <Counter count={count} />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
