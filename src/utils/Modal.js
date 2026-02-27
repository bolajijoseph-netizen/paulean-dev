// Modal2.jsx
import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
	  
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "900px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
	  <button onClick={onClose}  style={{color:"red",fontWeight:"bold",float:"right", border:"none"}}>x</button>
        {children}
      </div>
    </div>
  );
}