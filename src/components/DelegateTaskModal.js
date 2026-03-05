// src/components/DelegateTaskModal.jsx
import React, { useEffect, useRef, useState } from "react";

function getTodayLocalISO() {
	const d = new Date();

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	var hours = String(d.getHours()).padStart(2, "0");
	var minutes = String(d.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}`;

}


export default function DelegateTaskModal({
  open = false,
  defaultDeadline = getTodayLocalISO(),
  onClose = () => {},
  onSubmit = (payload) => {},
}) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(defaultDeadline || "");
  const [notes, setNotes] = useState("");
  const overlayRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      // reset or keep values as desired; here we reset title/notes but keep default deadline
      setTitle("");
      setNotes("");
      setDeadline(defaultDeadline || "");
      // focus title input after open
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, defaultDeadline]);

  useEffect(() => {
    function handleKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, title, deadline, notes]);

  if (!open) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSubmit() {
    const payload = {
      id: `d-${Date.now()}`,
      title: title.trim(),
      deadline: deadline || null,
      notes: notes.trim() || null,
      createdAt: new Date().toISOString(),
    };
    if (!payload.title) {
      titleRef.current?.focus();
      return;
    }
    onSubmit(payload);
    onClose();
  }

  return (
    <div
      className="modal-bg open"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Delegate task to Paulean"
    >
      <div className="modal sm" onClick={(e) => e.stopPropagation()}>
        <div className="delegate-modal-body">
          <div className="dm-title-row">
            <div className="dm-gem" aria-hidden="true">P</div>
            <input
              ref={titleRef}
              className="dm-title-inp"
              id="dm-title"
              placeholder="What do you need done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Task title"
            />
          </div>

          <div className="dm-deadline-row">
            <span className="dm-deadline-label">📅 Deadline</span>
            <input
              type="datetime-local"
              className="dm-deadline-inp"
              id="dm-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-label="Deadline"
            />
            <span style={{ fontSize: 11, color: "var(--text5)" }}>(optional)</span>
          </div>

          <textarea
            className="dm-notes"
            id="dm-notes"
            placeholder="Any context Paulean should know? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notes for Paulean"
          />

          <div className="dm-hint">
            Paulean will figure out <b>when to start</b> and the <b>estimated duration</b>. You'll get a notification when Paulean picks this up.
          </div>

          <div className="dm-actions" style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn-blue"
              style={{ flex: 2 }}
              type="button"
              onClick={handleSubmit}
            >
              ✦ Delegate to Paulean
            </button>
            <button
              className="btn-sec"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
// App.jsx (excerpt)
import React, { useState } from "react";
import DelegateModal from "./components/DelegateModal";

function App() {
  const [delegateOpen, setDelegateOpen] = useState(false);

  function handleSubmitDelegate(payload) {
    // payload: { id, title, deadline, notes, createdAt }
    console.log("Delegate submitted:", payload);
    // integrate with API or state here
  }

  return (
    <>
      <button onClick={() => setDelegateOpen(true)}>Open Delegate Modal</button>

      <DelegateModal
        open={delegateOpen}
        defaultDeadline={getTodayLocalISO()}
        onClose={() => setDelegateOpen(false)}
        onSubmit={handleSubmitDelegate}
      />
    </>
  );
}
*/
