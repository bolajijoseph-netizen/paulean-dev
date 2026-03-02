import React, { useEffect } from "react";

export default function SmallMessageModal({
  open,
  onClose,
  children,
  style = {},
  autoCloseMs = null   // e.g., 60000 for 1 minute
}) {

  // Auto-close effect
  useEffect(() => {
    if (!open || !autoCloseMs) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: "#ddc323",
          width: "300px",
          padding: "20px",
          borderRadius: "10px",
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          ...style
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
            color: "red",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}