"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
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
    if (room && username) {
      socketRef.current.emit("joinRoom", room);
    }
  };

  const sendMessage = () => {
    if (message.trim() && room) {
      socketRef.current.emit("sendMessage", { room, username, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}: </strong> {msg.message}
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
