import React ,{ useState, useEffect }from 'react';
import MoveToModal from './MoveToModal';
import {useUserTasks} from './UserTasksContext'
import TaskDetailModal from './TaskDetailModal';


export default function TaskCard({ task, onOpen, draggableProps }) {
	//const [task,setTask]=useState(task);
	const [localTask, setLocalTask] = useState(task);
	const {toggleDone} = useUserTasks();
	const [done,setDone]=useState('');
	const [taskDetailModal,setTaskDetailModal]=useState(false);
	const [contextMenu, setContextMenu] = useState({
			visible: false,
			x: 0,
			y: 0,
			task: null
			});

useEffect(() => {
  setLocalTask(task);	 
 },[task]);
			
const onClose = () => {setContextMenu(prev => ({...prev,visible: false  }));};




function formatSmartDateTime(dateString) {
  const input = new Date(dateString);
  const now = new Date();

  // Normalize dates to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inputDay = new Date(input.getFullYear(), input.getMonth(), input.getDate());

  // Format time as "10AM"
  const time = input.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: undefined,
    hour12: true
  }).replace(" ", "");

  // CASE 1: Today
  if (inputDay.getTime() === today.getTime()) {
    return time;
  }

  // CASE 2: Tomorrow
  if (inputDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow ${time}`;
  }

  // CASE 3: Yesterday
  if (inputDay.getTime() === yesterday.getTime()) {
    return `Yesterday ${time}`;
  }

  // CASE 4: Any other day → "Feb 26, 10AM"
  const dateLabel = input.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  return `${dateLabel}, ${time}`;
}

 const handleToggleDone = () => {
    setLocalTask(prev => ({ ...prev, done:!prev.done }));
	toggleDone(task);
  };

const handleOpenTaskDetailModal = () => {setTaskDetailModal(true);} 

  return (
    <div
      className={`tcard ${task.currentPlan} ${task.done ? 'done' : ''}`}
	  //className={["tcard",localTask.urgent && "urgent",localTask.done && "done",
	  //localTask.paulean&&localTask.pauleanQueued&&"p-queued",localTask.paulean&&!localTask.pauleanQueued&&"p-card"].filter(Boolean).join(" ")}
      draggable
      onDragStart={(e) => draggableProps.onDragStart(e, localTask)}
      onDragEnd={draggableProps.onDragEnd}
      //onContextMenu={(e) => draggableProps.onContextMenu(e, task)}
	  	onContextMenu={(e) => {
								e.preventDefault();
								setContextMenu({
											visible: true,
											x: e.clientX,
											y: e.clientY,
											task: task
											});
							}}
      onClick={handleOpenTaskDetailModal}
      data-task={localTask.title}
    >
      <div className="tc-top">
        <div className={`tc-check ${localTask.done ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleDone(localTask); }} />
        <div className="tc-body">
          <div className="tc-title" title={localTask.title}>{localTask.title}</div>
          <div className="tc-foot">
            {localTask.dateTime && <span className="tc-time">{formatSmartDateTime(localTask.dateTime)}</span>}
            {localTask.duration && <span className="tc-dur">{localTask.duration}</span>}
            {localTask.paulean && <span className="pill pill-a">✦ {localTask.pauleanQueued ? 'Queued' : 'In Progress'}</span>}
			{localTask.percentComplete>0 && <span style={{fontSize: '0.55em', color: 'green'}}>{localTask.percentComplete + ' %'}</span>}
          </div>
		   
        </div>
      </div>
	 {taskDetailModal && (
	 <TaskDetailModal
        open={taskDetailModal}
	    inTask={task}
        onClose={() => setTaskDetailModal(false)}
      />
	)}
	 {contextMenu.visible && (
	  <MoveToModal isOpen={contextMenu.visible} task={localTask} onClose={onClose} />
	  )}
    </div>
  );
}

