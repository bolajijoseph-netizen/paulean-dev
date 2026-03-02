// src/components/AddTaskModal.jsx
import React, { useEffect, useRef, useState } from "react";
import {useUserTasks} from './UserTasksContext'
import { useAuth } from './auth/AuthContext';
import { useUserProfile } from "./UserProfileContext";
import SmallMessageModal from '../utils/SmallMessageModal';


export default function AddTaskModal({
  open1 = false,
  onClose = () => {},
  onAdd = (task) => {},
  onDelegate = (task) => {},
  defaultCurrentPlan="today",
  defaultDateTime=''
}) {
  const [title, setTitle] = useState("");

  const [duration, setDuration] = useState("30 min");
  //const [list, setList] = useState("Today's Plan");
  const [currentPlan, setCurrentPlan] = useState(defaultCurrentPlan);
  //const [messages, setMessaages] = useState("");
  const [notes, setNotes] = useState("");
  const bgRef = useRef(null);
  const { tasks, addTask, toggleDone, moveTaskTo, delegateTask } = useUserTasks();
  const { user} = useAuth();
  const { profile} = useUserProfile();
  const [delegatedToPaulean,setDelegatedToPaulean]=useState(false);
  const [open,setOpen]=useState(true);
 

  
  function getTodayLocalISO() {
	const d = new Date();

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	var hours = String(d.getHours()).padStart(2, "0");
	var minutes = String(d.getMinutes()).padStart(2, "0");
	
	// Round to nearest 30 minutes
	if (minutes < 15) {
		minutes = "00";
	} else if (minutes < 45) {
		minutes = "30";
	} else {
		minutes = "00";
		hours += 1;
	}

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

	const [dateTime, setDateTime] = useState(defaultDateTime||getTodayLocalISO());



  useEffect(() => {
    if (open) {
      // reset fields when opened
      setTitle("");
      setDateTime(dateTime||getTodayLocalISO());
      setDuration("30 min");
      setCurrentPlan(defaultCurrentPlan);
      setNotes("");
      // focus title input after open
      setTimeout(() => {
        const el = document.querySelector(".modal-title-inp");
        if (el) el.focus();
      }, 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd(); // Cmd/Ctrl+Enter to submit
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, title, dateTime, duration, currentPlan, notes]);

  if (!open) return null;

  function handleBgClick(e) {
    // close when clicking the overlay background
    if (e.target === bgRef.current) onClose();
  }

  function handleAdd() {
    const task = {
	  taskId:Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
	  userId: profile.uid,
	  username:profile.firstName+" "+profile.lastName,
      title: title.trim(),
      dateTime: dateTime||getTodayLocalISO(),
      duration,
      currentPlan,
      notes: notes.trim(),
	  done:false,
	  delegatedToPaulean:delegatedToPaulean
    };
    if (!task.title) {
      // simple validation: require title
      const el = document.querySelector(".modal-title-inp");
      if (el) el.focus();
      return;
    }
	console.log(`in AddTskModal date time: ${task.dateTime}`);
    addTask(task);
    onClose();
  }

const handleDelegateTask = () => {setDelegatedToPaulean(true)}
  
  return (
    <div
      className="modal-bg open"
      ref={bgRef}
      onClick={handleBgClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-circle" aria-hidden="true" />
          <input
            className="modal-title-inp"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to get done?"
            aria-label="Task title"
          />
          <div
            className="modal-x"
            role="button"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            aria-label="Close"
          >
            ✕
          </div>
        </div>

        <div className="modal-body">
          <div className="mrow">
            <div className="mrow-ic">📅</div>
            <div className="mrow-lbl">Date &amp; time</div>
            <input
              type="datetime-local"
              className="minput"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div className="mrow">
            <div className="mrow-ic">⏱</div>
            <div className="mrow-lbl">Duration</div>
            <select
              className="msel"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>10 min</option>
              <option>15 min</option>
              <option>30 min</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>

          <div className="mrow">
            <div className="mrow-ic">🏷</div>
            <div className="mrow-lbl">Add to</div>
            <select
              className="msel"
              value={currentPlan}
              onChange={(e) => setCurrentPlan(e.target.value)}
            >
				<option value="today">Today's Plan</option>
				<option value="yesterday">Yesterday</option>
				<option value="urgent">Urgent</option>
				<option value="backlog">Backlog</option>
            </select>
          </div>

          <div className="mdivider" />

          <div className="msec">Notes</div>
          <textarea
            className="mtextarea"
            placeholder="Any context…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="mdivider" />

          <div className="delegate-box">
            <div className="delegate-box-title">✦ Let Paulean handle this instead?</div>
            <div className="delegate-box-desc">
              Hand it off and just set a deadline — Paulean will plan the timing and estimate duration.
            </div>
            <div className="delegate-acts" style={{ marginTop: 10 }}>
              <button
                className="btn-blue"
                type="button"
                onClick={handleDelegateTask}
              >
                ✦ Delegate to Paulean
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={handleAdd}
                style={{ marginLeft: 8 }}
              >
                I'll handle it
              </button>
            </div>
          </div>
        </div>
        <div className="modal-ftr" style={{ display: "flex", gap: 8, padding: 12 }}>
          <button className="btn-sec" onClick={onClose}>Cancel</button>
          <button className="btn-pri" onClick={handleAdd}>Add Task</button>
        </div>
      </div>
	  {!user && (
		<SmallMessageModal
			open={!user}
			onClose={onClose}
			style={{ background: "#f4d03f" }}
			>
			<span>Kindly Login or Sign up to proceed</span>
		</SmallMessageModal>
		)}
    </div>
  );
}

/*
// in App.jsx or parent component
import React, { useState } from "react";
import AddTaskModal from "./components/AddTaskModal";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  function handleAdd(task) {
    setTasks((t) => [task, ...t]);
    console.log("Added task", task);
  }

  function handleDelegate(task) {
    // call delegate API or mark task for Paulean
    console.log("Delegate to Paulean:", task);
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Add Task</button>
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        onDelegate={handleDelegate}
        defaultDateTime="2026-02-20T14:00"
      />
    </>
  );
}
*/