import React,{useState} from 'react';
import TaskDetailModal  from './TaskDetailModal';


 

export default function ArchiveTasksPanel({ open, onClose, tasks, onOpenArchive }) {

const [task,setTask]=useState('');
const [openTask,setOpenTask]=useState(false);
const [search,setSearch]=useState('');

const onSave = () => {};
const onDelegate = () => {};

const handleSearch = (e) => {
  setSearch(e.target.value);
};

const filteredTasks = tasks.filter(t =>
  t.title.toLowerCase().includes(search.toLowerCase())
);

const handleOpenArchive = (task) =>{
		console.log(`In handleOpenArchive ${task.taskId}`);
        onOpenArchive(task);
  };
	
  return (
    <div className={`paulean-panel ${open ? 'open' : ''}`}>
      <div className="archive-header">
        <div className="archive-title">📦 Tasks Archive</div>
        <div className="archive-close" onClick={onClose}>✕</div>
      </div>
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <label>Search:</label>
  <input
    type="search"
    value={search}
    onChange={handleSearch}
    style={{
      border: "none",
      borderBottom: "1px solid #A3A3A7",
      outline: "none",
      padding: "4px 6px",
      width: "70%",
	  marginBottom:"10px"
    }}
  />
</div>

<div className="archive-body">
  {filteredTasks.map((t) => (
    <div
      key={t.taskId}
      className="archive-task"
      onClick={() => handleOpenArchive(t)}
    >
      <div className="archive-task-row1">
        <div
          className="archive-task-title"
          style={{ border: "none", background: "transparent" }}
        >
          {t.title}
        </div>
		</div>
	   </div>
		))}
	</div>
    </div>
  );
}




    

