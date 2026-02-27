import React, { useState, useEffect } from 'react';
import './global.css';
import Sidebar from './components/Sidebar';
import Kanban from './components/Kanban';
import PauleanPanel from './components/PauleanPanel';
import ChatPanel from './components/ChatPanel';
import { initialColumns, initialTasks } from './data';
import UserMain from './components/UserMain';
import DelegateTaskModal from './components/DelegateTaskModal';
import SettingsView from './components/SettingsView1';
import AddTaskModal from './components/AddTaskModal';

export default function App() {
  const [view, setView] = useState('board');
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [pauleanOpen, setPauleanOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTask, setChatTask] = useState('');
  const [delegateTask, setDelegateTask]=useState(false);
  const [settingsView, setSettingsView]=useState(true);
  const [addTask, setAddTask]=useState(false);
  

  useEffect(() => {
    // Example: open morning check-in or demo notifications
  }, []);

  const handlers = {
    onDragStart: (e, task) => {
      e.dataTransfer.setData('text/plain', task.id);
    },
    onDragEnd: () => {},
    onDragOver: (e, colId) => e.preventDefault(),
    onDrop: (e, colId) => {
      const id = e.dataTransfer.getData('text/plain');
      setTasks(prev => prev.map(t => t.id === id ? { ...t, col: colId } : t));
    },
    onContextMenu: (e, task) => {
      e.preventDefault();
      // show move menu
    },
    openDetail: (task) => {
      // open detail modal (not implemented in this excerpt)
      alert('Open detail: ' + task.title);
    },
    toggleDone: (task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
    },
    openAdd: (colId) => {
      // open add modal
      //alert('Open add for ' + colId);
	  setAddTask(true);
	  
    },
	submitAddTask(task) {	
	// push task to tasks.		
	}
	
  };

  function openChat(taskTitle) {
    setChatTask(taskTitle);
    setChatOpen(true);
  }
  
  function openChat(label) { console.log("open chat:", label); }
  function openAdd() { console.log("open add modal"); }
  function openDelegate() { console.log("open delegate"); }
  function dismissPager() { console.log("pager dismissed"); }
  function switchView(v) { console.log("switch view:", v); }
  function setInc(i) { console.log("increment:", i); }
  function selectColumn(col) { console.log("select column:", col); }
  function handleSubmitDelegate() {console.log("handle submit delegate");}
  
  function connectCal(id) { console.log("connect", id); }
  function showNotif(title, msg, type) { console.log("notif", title, msg, type); }
  function saveWorkHours(payload) { console.log("save work hours", payload); }
  function toggleWorkPaulean(enabled) { console.log("work paulean", enabled); }
  function updateLocation(id) { console.log("update location", id); }

  return (
	<div>
	<div>
	<UserMain
      onOpenMobile={() => console.log("open mobile")}
      onOpenDelegate={openDelegate}
      onOpenChat={() => setChatOpen(true)}
      onOpenAdd={openAdd}
      onDismissPager={dismissPager}
      onSwitchView={switchView}
      onSetIncrement={setInc}
      onSelectColumn={selectColumn}
    />
	</div>

    <div className="app">
      <Sidebar onNav={setView} onTogglePP={() => setPauleanOpen(v => !v)} onOpenDelegate={() => setDelegateTask(true)} active={view==='board' ? 'board' : view} />
      <PauleanPanel open={pauleanOpen} onClose={() => setPauleanOpen(false)} tasks={tasks.filter(t => t.paulean)} openChat={openChat} />
	  {view==='settings' &&(<SettingsView
	  onClose={() => setView('board')}
      onConnectIntegration={connectCal}
      onShowNotif={showNotif}
      onSaveWorkHours={saveWorkHours}
      onToggleWorkPaulean={toggleWorkPaulean}
      onUpdateLocation={updateLocation}
    />)}
      <main className="main" style={{ display: view === 'board' ? 'flex' : 'none', flexDirection: 'column' }}>
        <div className="kanban-wrap" style={{ flex: 1 }}>
          <Kanban columns={columns} tasks={tasks} handlers={handlers} />
        </div>
      </main>
      {chatOpen && (<ChatPanel open={chatOpen} taskLabel={chatTask} onClose={() => setChatOpen(false)} />)}
    </div>
	{delegateTask && (
	 <DelegateTaskModal
        open={delegateTask}
        defaultDeadline="2026-02-28T17:00"
        onClose={() => setDelegateTask(false)}
        onSubmit={handleSubmitDelegate}
      />
	
	)}
	{addTask && (
	 <AddTaskModal
        open={addTask}
        defaultDeadline="2026-02-28T17:00"
        onClose={() => setAddTask(false)}
        onSubmit={handlers.submitAddTask}
      />
	
	)}
	
	
	</div>
  );
}

/*
Notes and migration tips
• 	CSS: I kept the original stylesheet intact. Import  once in your entry file. The original file uses many global classes; this conversion keeps them to preserve visuals.
• 	Drag & Drop: I used native HTML5 drag events in the example. For production, consider  for robust behavior across touch devices.
• 	State: The example uses local . Replace with context or Redux if you need cross-app persistence.
• 	Modals & Panels: I implemented basic open/close flows. The original file had many interactive behaviors (timers, notifications, demo sequences). Recreate those in  hooks as needed.
• 	Accessibility: Add  attributes and keyboard handlers for full accessibility.
• 	Assets & fonts: Keep the Google Fonts  in  or import via CSS .
• 	Server integration: Replace  placeholders with real modal components and API calls.
*/