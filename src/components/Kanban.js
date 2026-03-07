import React,{ useState, useEffect }  from 'react';
import TaskCard from './TaskCard';
import DayTimeSlots from './DayTimeSlots'
import ArchiveTasksPanel  from './ArchiveTasksPanel';

export default function Kanban({ columns, tasks, handlers }) {
	
 

function getPlan(dateString) {
  const input = new Date(dateString);
  const now = new Date();

  // Normalize dates to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inputDay = new Date(input.getFullYear(), input.getMonth(), input.getDate());

  // CASE 1: Today
  if (inputDay.getTime() === today.getTime()) {
    return "today";
  }

    // CASE 2: Yesterday
  if (inputDay.getTime() === yesterday.getTime()) {
    return "yesterday";
  }

  // CASE 3: Any other day 
  return "backlog";
}

	
  return (
 <div className="kanban-wrap">
  {Object.values(columns).map((col) => (
    <div className="kcol" key={col.id}>
      <div className={`kcol-header ${col.id}`}>
		<span className={`kcol-icon col-${col.id}`}></span>
        <div className="kcol-title">{col.title}</div>
        <div className={`kcol-count kcol-${col.id}`}>
          {
            tasks.filter(
              (t) =>
                t.currentPlan === col.id ||
                (t.delegatedToPaulean && col.id === "paulean")
            ).length
          }
        </div>
      </div>

      <div
        className="kcol-body"
        onDragOver={(e) => handlers.onDragOver(e, col.id)}
        onDrop={(e) => handlers.onDrop(e, col.id)}
      >
        {/* TODAY COLUMN USES TIMELINE */}
        {col.id === "today" && (
          <DayTimeSlots handlers={handlers} inTasks={tasks}  />
        )}

        {/* ALL OTHER COLUMNS USE NORMAL TASKCARDS */}
        {col.id !== "today" &&
          tasks
            .filter(
              (t) =>
                t.currentPlan === col.id ||
                (t.delegatedToPaulean && col.id === "paulean")
            )
            .map((t,index) => (
			
              <TaskCard
                key={index}
                task={t}
                onOpen={() => handlers.openDetail(true)}
                onToggleDone={handlers.toggleDone}
                draggableProps={handlers}
              />
            ))			
			}

        <div
          className="add-slot-btn"
          onClick={() => handlers.openAdd(col.id)}
        >
		＋ Add Task
        </div>
      </div>
    </div>
  ))}
</div>)

}