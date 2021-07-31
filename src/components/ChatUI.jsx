import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import "./ChatUI.css";
import Loader from "react-loader-spinner";

function ChatUI() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <div className="chat__ui">
        {loading ? (
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
          />
        ) : (
            <div className="chat__uiContainer">
              <Sidebar />
              <Chat />
            </div>
        )}
      </div>
    </>
  );
}

export default ChatUI;
