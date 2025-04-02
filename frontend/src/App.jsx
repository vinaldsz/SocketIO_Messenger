import { useEffect, useState } from "react";
import socket from "./socket/MySocket.js";
import "./App.css"; // Import the CSS file

export default function App() {
  const [messageHistory, setmessageHistory] = useState([]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const input = event.target.elements.msg;
    const message = {
      text: input.value,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", message);
    input.value = "";
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Message from server:", message);
      setmessageHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div>
      <h1>Socket.io Chat</h1>
      <ul id="messages">
        {messageHistory.map((msg, index) => (
          <li
            key={index}
            className={
              msg.senderId === socket.id ? "message-right" : "message-left"
            }
          >
            <strong>{msg.senderId === socket.id ? "You" : msg.senderId}</strong>{" "}
            @ {new Date(msg.timestamp).toLocaleTimeString()}: {msg.text}
          </li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSendMessage}>
        <input id="input" name="msg" autoComplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
