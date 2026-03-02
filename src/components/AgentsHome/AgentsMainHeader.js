// src/components/UserMain.jsx
import React, { useState, useEffect } from "react";
import AddTaskModal from "./AddTaskModal";
import {useUserTasks} from './UserTasksContext';

export default function MainHeader({
  // callbacks
  onOpenMobile = () => {},
  onOpenDelegate = () => {},
  onOpenChat = (label) => {},
  onDismissPager = () => {},
  onSwitchView = (view) => {},
  onSetIncrement = (inc) => {},
  onSelectColumn = (colId) => {},
  // props
  pager = {
    visible: true,
    pill: "✈ Flight Options",
    message: "<b>Rome trip:</b> Found 3 options. Delta nonstop $892 looks best — confirm to book?",
    chatLabel: "Book flight to Rome for Italy trip",
  }
  
}) {
  const [activeVTab, setActiveVTab] = useState("board"); // 'board' | 'cal' | ...
  const [activeInc, setActiveInc] = useState("30m");
  const [activeMCol, setActiveMCol] = useState("today");
  const [pagerVisible, setPagerVisible] = useState(Boolean(pager.visible));
  const [addTaskModal,setAddTaskModal]=useState(false);
  const {tasks,latestMessage,latestTaskId} = useUserTasks();
  const [stats,setStats]=useState('');
  
  
  useEffect(() => {
	console.log(`In MainHeader latestMessage ${latestMessage} latestTaskId ${latestTaskId}`);
	}, [latestMessage]);


  
 useEffect(() => {
   const pauleanProgress = (() => {
	const list = tasks.filter(t => t.delegatedToPaulean && !t.done);
	return list.length ? list.reduce((s, t) => s + Number(t.percentComplete ?? 0), 0) / list.length : 0;
	})();


  setStats({
    today: `${tasks.filter(t=>t.currentPlan=='today').length} tasks`,
    done: `${tasks.filter(t=>t.done).length} tasks`,
    paulean:`✦ ${tasks.filter(t=>t.delegatedToPaulean&&!t.done).length} active`,
    progress: pauleanProgress  // percent
  });
  
 }, [tasks]);
 
  useEffect(() => {
    setPagerVisible(Boolean(pager.visible));
  }, [pager.visible]);

  function handleSwitchView(view) {
    setActiveVTab(view);
    onSwitchView(view);
  }

  function handleSetInc(value) {
    setActiveInc(value);
    onSetIncrement(value);
  }

  function handleMCol(colId) {
    setActiveMCol(colId);
    onSelectColumn(colId);
  }
  
  const onOpenAdd = () => {setAddTaskModal(true);};
  const handleAddTask = () => {};
  const handleDelegateTask = () => {};
  
  function formatToday() {
  const today = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
  
  const parts = formatter.formatToParts(today);
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return `${map.weekday}, ${map.month} ${map.day} · ${map.year}`;
}

const dateLabel = formatToday(); //"Fri, Feb 20 · 2026",


function getTodayLocalISO() {
  const d = new Date();

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const handleIsMobile = () =>{console.log('In handleIsMobile'); onOpenMobile();}

  return (
    <div className="main" id="user-main">
      <div className="m-topbar">
        <div
          className="m-burger"
          role="button"
          tabIndex={0}
          onClick={handleIsMobile}
          onKeyDown={(e) => e.key === "Enter" && onOpenMobile()}
          aria-label="Open mobile menu"
        >
          ☰
        </div>

        <div className="m-logo">✦ Paulean</div>

        <button
          className="m-add"
          onClick={onOpenDelegate}
          aria-label="Open delegate"
        >
          ✦
        </button>
      </div>

      {/* Pager — light blue */}
      {pagerVisible && (
        <div
          className="pager"
          id="pager"
          onClick={() => onOpenChat(latestTaskId)}
          role="button"
          tabIndex={0}
        >
		{/*<div className="pager-pill">{pager.pill}</div>*/}
          <div
            className="pager-msg"
            // message may contain markup; parent should sanitize if needed
            dangerouslySetInnerHTML={{ __html: latestMessage }}
          />
          <div className="pager-acts">
            <button
              className="pager-dismiss"
              onClick={(e) => {
                e.stopPropagation();
                setPagerVisible(false);
                onDismissPager();
              }}
            >
              Dismiss
            </button>
            <button
              className="pager-reply"
              onClick={(e) => {
                //e.stopPropagation();
                onOpenChat(latestTaskId);
              }}
            >
              💬 View &amp; Reply ›
            </button>
          </div>
        </div>
      )}

      <div className="topbar desktop-only">
	    <div className="topbar-date">
          <b>{dateLabel.split("·")[0]?.trim()}</b> · {dateLabel.split("·")[1]?.trim() || ""}
        </div>
        <div className="view-tabs">
          <button
            className={`vtab ${activeVTab === "board" ? "active" : ""}`}
            onClick={() => handleSwitchView("board")}
          >
            Today
          </button>
          <button
            className={`vtab ${activeVTab === "cal" ? "active" : ""}`}
            onClick={() => handleSwitchView("cal")}
          >
            Calendar
          </button>
          <button
            className={`vtab ${activeVTab === "urgent" ? "active" : ""}`}
            onClick={() => handleSwitchView("urgent")}
          >
            Urgent
          </button>
          <button
            className="vtab"
            onClick={() => {
              handleSwitchView("paulean");
              // also toggle Paulean panel if needed
            }}
          >
            ✦ Paulean
          </button>
        </div>

 

        <button className="add-btn" onClick={() =>setAddTaskModal(true)}>
          ＋ Add Task
        </button>
      </div>

      <div className="stats desktop-only">
        <div className="stat">
          <span className="stat-l">Today</span>
          <span className="stat-v">{stats.today}</span>
        </div>
        <div className="stat">
          <span className="stat-l">Done</span>
          <span className="stat-v g">{stats.done}</span>
        </div>
        <div className="stat">
          <span className="stat-l">Paulean</span>
          <span className="stat-v b">{stats.paulean}</span>
        </div>
        <div className="stat" style={{ alignItems: "center", gap: 8 }}>
          <span className="stat-l">Progress</span>
          <div className="prog-bar" style={{ marginRight: 8 }}>
            <div className="prog-fill" style={{ width: `${stats.progress}%` }} />
          </div>
          <span className="stat-v" style={{color:"orange"}}>{stats.progress}%</span>
        </div>
      </div>

      <div className="m-col-tabs" id="mctabs">
        {[
          { id: "today", label: "Today" },
          { id: "yesterday", label: "Yesterday" },
          { id: "urgent", label: "Urgent" },
          { id: "paulean", label: "✦ Paulean" },
          { id: "backlog", label: "Backlog" },
        ].map((c) => (
          <div
            key={c.id}
            className={`mctab ${activeMCol === c.id ? "active" : ""}`}
            onClick={() => handleMCol(c.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleMCol(c.id)}
          >
            {c.label}
          </div>
        ))}
      </div>
	  
	  {addTaskModal&& (
	  <AddTaskModal
        onClose={() => setAddTaskModal(false)}
        onAdd={handleAddTask}
        onDelegate={handleDelegateTask}
      />  
	  )}
	  
    </div>
  );
}