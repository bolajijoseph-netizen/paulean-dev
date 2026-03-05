import React,{useState,useEffect} from "react";
import {useUserTasks} from './UserTasksContext';
import { userKanbanColumns, durationOptions } from '../utils/data';;

export default function TaskDetailModal({
  open,
  inTask,
  onClose,
  onSave,
  onDelegate,
  
}) {
	

	const {updateTask,deleteTask} = useUserTasks();
	const [task,setTask]=useState(inTask);	

  if (!open || !task) return null;
  
  
  console.log('In TaskDetailModal');
  console.log(task);
  
  const handleChange = (updates) => {
  setTask(prev => ({
    ...prev,
    ...updates
  }));
  
};


const handleSave = () => {
	updateTask(task.taskId,task);
	onClose();
	} 

const handleDelete = () => {
	deleteTask(task.taskId);
	onClose();
	}

function getDateLocalISO(date) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  //return `${year}-${month}-${day} ${hours}:${minutes}`; //Feb 20, 2026 · 2:00 PM
  
}

function formatPrettyDate(d) {
	const date= new Date(d);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0 → 12

  return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
}

const delegateToPaulean = () =>{
	const updatedTask = {...task,delegatedToPaulean:true,currentPlan:"paulean"}
	setTask(updatedTask);
}



  return (
    <div className="modal-bg open" onClick={onClose}  onContextMenu={(e) => e.stopPropagation()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-hdr">
          <div className="modal-circle"></div>

          <input
            className="modal-title-inp"
            value={task.title || ""}
            onChange={(e) => handleChange({ title: e.target.value })}
          />

          <div className="modal-x" onClick={onClose}>✕</div>
        </div>

        {/* BODY */}
        <div className="modal-body">

          <div className="mrow">
            <div className="mrow-ic">📅</div>
            <div className="mrow-lbl">Date</div>
            <div className="mrow-val">
              {formatPrettyDate(task.dateTime)}
            </div>
          </div>

          <div className="mrow">
            <div className="mrow-ic">⏱</div>
            <div className="mrow-lbl">Duration</div>
			
            <select
              className="msel"
              value={task.duration}
              onChange={(e) => handleChange({ duration: e.target.value })}
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
            <div className="mrow-lbl">Label</div>
            <div className="mrow-val tap">{task.label || "None"}</div>
          </div>

          <div className="mrow">
            <div className="mrow-ic">🔁</div>
            <div className="mrow-lbl">Repeats</div>
            <div className="mrow-val">Does not repeat</div>
          </div>

          <div className="mdivider"></div>

          <div className="msec">Notes</div>

          <textarea
            className="mtextarea"
            placeholder="Add notes…"
            value={task.notes || ""}
            onChange={(e) => handleChange({ notes: e.target.value })}
          />
		  
		  <div>
		  <label className="mrow-lbl">%Complete:</label>
		  <input
            className="modal-title-inp"
            value={task.done?100:task.percentComplete ||""}
			type="range"
			min="0" max="100"
            onChange={(e) => handleChange({ percentComplete: e.target.value })}
          />
		  <sup style={{ fontSize: '0.55em', color: 'green' }}>  {task.done?100:task.percentComplete}</sup>
		  </div>

		<div>
				
		  <label className="mrow-lbl">Move To :</label>
		  <select
              className="msel"
              value={task.currentPlan}
              onChange={(e) => handleChange({ currentPlan: e.target.value })}
            >
             {userKanbanColumns.map((opt) => (
			<option key={opt.value} value={opt.value}>
				{opt.label}
			</option>
			))}

            </select>
			
			
		  </div>	


          <div className="mdivider"></div>

          {/* DELEGATE BOX */}
          <div className="delegate-box">
            <div className="delegate-box-title">✦ Let Paulean handle this?</div>
            <div className="delegate-box-desc">
              Paulean will take ownership and update you when it's done.
            </div>

            <button
              className="btn-blue"
              style={{ width: "100%" }}
              onClick={delegateToPaulean}
            >
              ✦ Delegate to Paulean
            </button>
          </div>
        </div>

        {/* FOOTER */}
		<div className="modal-ftr">
			<div className="left-buttons">
				<button className="btn-cancel" onClick={onClose}>Cancel</button>
				<button className="btn-save" onClick={handleSave}>Save</button>
			</div>
			<button className="btn-del" onClick={handleDelete}>Delete</button>
		</div>

      </div>
    </div>
  );
}
