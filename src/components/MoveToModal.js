import React from "react";
import Modal from './Modal';
import {useUserTasks} from './UserTasksContext'

export default function MoveToModal({
  isOpen,
  onClose,
  task
}) {
	
  const {moveTaskTo} = useUserTasks();
  if (!isOpen) return null;

  const options = [
    { key: "today",     icon: "📋", label: "Today's Plan" },
    { key: "yesterday", icon: "📅", label: "Yesterday" },
    { key: "urgent",    icon: "⚡", label: "Urgent" },
    //{ key: "paulean",   icon: "✦", label: "Paulean" },
    { key: "backlog",   icon: "📦", label: "Backlog" }
  ];
  
  const handleMoveTaskTo = (task,newPlan) =>{console.log(`move ${task.title} to ${newPlan}`);
											moveTaskTo(task,newPlan);
}

  return (
        <div
        className="move-menu1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="move-menu-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
		<span>Move to…</span>
		<button
          onClick={onClose}
          className="moveTo-x"
          style={{
            background: "transparent",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
            padding: "2px 6px"
          }}
        >
          ✕
        </button>
		</div>
        <div >
          {options.map(opt => (
            <button
              key={opt.key}
              className="move-opt"
              onClick={() => handleMoveTaskTo(task,opt.key)}
			  style={{border:"none", background:"transparent"}}
            >
              <span className="mo-icon">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
  );
}

/*
<div> 
      <div
        className="move-menu1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="move-menu-header">Move to…</div>
        <div >
          {options.map(opt => (
            <button
              key={opt.key}
              className="move-opt"
              onClick={() => onMoveTo(opt.key)}
			  style={{border:"none"}}
            >
              <span className="mo-icon">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
	*/
	
/*
<div className="move-modal-overlay" onClick={onClose}>
      <div
        className="move-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="move-modal-header">Move to…</div>

        <div className="move-modal-options">
          {options.map(opt => (
            <button
              key={opt.key}
              className="move-opt"
              onClick={() => MoveTo(opt.key)}
            >
              <span className="mo-icon">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
*/
