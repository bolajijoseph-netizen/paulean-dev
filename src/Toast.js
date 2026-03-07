
import { useEffect, useState } from "react"

export default function Toast({ message, actionLabel, onAction, onClose }) {
  const [visible, setVisible] = useState(false)

  // Trigger fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // When closing, fade out first
  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300) // match CSS transition duration
  }

  return (
    <div className={`toast ${visible ? "show" : "hide"}`}>
      <span>{message}</span>

      {actionLabel && (
        <button className="toast-action"
          onClick={() => {
            onAction?.()
            handleClose()
          }}
        >
          {actionLabel}
        </button>
      )}

      <button className="toast-x" onClick={handleClose}>✕</button>
    </div>
  )
}

/*
export default function Toast({ message, actionLabel, onAction, onClose }) {
  return (
    <div className="toast">
      <span>{message}</span>
      {actionLabel && (
        <button className="toast-action" onClick={() => {onAction?.();onClose();}}>
          {actionLabel}
        </button>
      )}
      <button className="toast-x" onClick={onClose}>✕</button>
    </div>
  );
}

*/







