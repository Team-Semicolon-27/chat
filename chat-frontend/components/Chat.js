"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [notionId, setNotionId] = useState(""); // Room ID
  const [sender, setSender] = useState(""); // Username
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (notionId && sender) {
      socketRef.current.emit("joinRoom", notionId);
      console.log(`User ${sender} joined room ${notionId}`);
    }
  };

  const sendMessage = () => {
    if (message.trim() && notionId && sender) {
      socketRef.current.emit("sendMessage", {
        notionId,
        sender,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <input
        type="text"
        placeholder="Enter your name"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />
      <input
        type="text"
        placeholder="Notion ID (Room ID)"
        value={notionId}
        onChange={(e) => setNotionId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}: </strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
