import React, { useState, useEffect } from 'react';
//import './global.css';
import './styles/usersglobal.css';

import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import { useAuth } from './components/auth/AuthContext';
import UserProfile from './components/UserProfile';
import { useUserProfile } from "./components/UserProfileContext";

import Sidebar from './components/Sidebar';
import Kanban from './components/Kanban';
import PauleanPanel from './components/PauleanPanel';
import ChatPanel from './components/ChatPanel';
import { initialColumns, initialTasks } from './data';
import MainHeader from './components/MainHeader';
import DelegateTaskModal from './components/DelegateTaskModal';
import SettingsView from './components/SettingsView';
import AddTaskModal from './components/AddTaskModal';
import {useUserTasks} from './components/UserTasksContext';
import {playNotificationTone} from './utils/soundUtil';



export default function Home() {
  const [view, setView] = useState('board');
  const [columns] = useState(initialColumns);
  const { tasks, addTask, toggleDone, moveTaskTo, loadUserTasks, latestMessage } = useUserTasks();
  const [pauleanOpen, setPauleanOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTaskId, setChatTaskId] = useState('');
  const [delegateTask, setDelegateTask]=useState(false);
  const [settingsView, setSettingsView]=useState(true);
  const [addTaskModal, setAddTaskModal]=useState(false);
  const [taskDetailModal, setTaskDetailModal]=useState(false);
  const [openMobile, setOpenMobile]=useState(false);
  
  const { user, loading } = useAuth();
  const { profile, profileLoading } = useUserProfile();
  const [loginClicked, setLoginClicked] = useState(false);
  const [defaultCurrentPlan, setDefaultCurrentPlan] = useState("");
  const [prevMessage,setPrevMessage]=useState(' ');
  const [openPhoneSideBar, setopenPhoneSideBar]=useState(false);
  const [isMobile, setIsMobile]=useState(false);
  const [draggedTask,setDraggedTask]=useState(null);
  
  useEffect(() => {
  if (!latestMessage) return;

  // Only trigger when the message actually changes
  if (latestMessage !== prevMessage) {
    // Do something here (play sound, show toast, etc.)
    console.log(`About to play sound for ${latestMessage}`);
    playNotificationTone();
    setPrevMessage(latestMessage);
  }
}, [latestMessage]);



  useEffect(() => {
    loadUserTasks(user);
  }, [user]);

  const handlers = {
    onDragStart: (e, task) => {
      e.dataTransfer.setData('taskId', task.taskId);
	  setDraggedTask(task);
    },
    onDragEnd: () => {},
    onDragOver: (e, colId) => e.preventDefault(),
    onDrop: (e,colId) => {
	  moveTaskTo(draggedTask,colId);
    },
    onContextMenu: (e, task) => {
      e.preventDefault();
      // show move menu
    },
    openDetail: (task) => {
      // open detail modal (not implemented in this excerpt)
      //alert('Open detail: ' + task.title);
	  setTaskDetailModal(true);
    },
    openAdd: (colId) => {
      // open add modal
      //alert('Open add for ' + colId);
	  setDefaultCurrentPlan(colId);
	  setAddTaskModal(true);
	  
    },
	submitAddTask(task) {	
	// push task to tasks.		
	}
	
  };

  const openChat = (taskId) => {
    setChatTaskId(taskId);
    setChatOpen(true);
  }
  
  //function openChat(label) { console.log("open chat:", label); }
  //function openAdd() { console.log("open add modal"); }
  
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
 
  
  function fn_defaultDateTime() {

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 0-based
  const day = String(now.getDate()).padStart(2, "0");
  
  let h = now.getHours();
  let m= now.getMinutes();

  // Round to nearest 30 minutes
/*
  if (m < 15) {
    m = 0;
  } else if (m < 45) {
    m = 30;
  } else {
    m = 0;
    h += 1;
  }
  */

  //return new Date(year, month, day, h, m, 0, 0);
  return `${year}-${month}-${day}T${h}:${m}`;
}
  
  const handleLoginComplete = () => {
    setLoginClicked(false);
  };
  
  function getDeviceType() {
  const width = window.innerWidth;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  if (width <= 768 || (isTouch && isCoarse)) return "phone";
  if (width <= 1024) return "tablet";
  return "desktop";
}

const isDesktop = getDeviceType()=='desktop';
const isPhone = getDeviceType()=='phone';



  return (
	<div>
<header className="App-header">
  <nav className="nav1">
    <div className="nav-container1" style={{ 
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    }}>
      

    </div>
  </nav>
</header>
	<div >
	<MainHeader
      onOpenMobile={() => setIsMobile(true)}
      onOpenDelegate={openDelegate}
      onOpenChat={openChat}
      onOpenAdd={() => setAddTaskModal(true)}
      onDismissPager={dismissPager}
      onSwitchView={switchView}
      onSetIncrement={setInc}
      onSelectColumn={selectColumn}
    />
	</div>
    <div className="app">
	  <Sidebar onNav={setView} isMobile={isMobile} onClose={() => setIsMobile(false)} onTogglePP={() => setPauleanOpen(v => !v)} onOpenDelegate={() => setDelegateTask(true)} active={view==='board' ? 'board' : view} />
      <PauleanPanel open={pauleanOpen} onClose={() => setPauleanOpen(false)} tasks={tasks.filter(t => t.delegatedToPaulean)} openChat={openChat} />
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
      {chatOpen && (<ChatPanel open={chatOpen} chatTaskId={chatTaskId} onClose={() => setChatOpen(false)} />)}
    </div>
	{delegateTask && (
	 <DelegateTaskModal
        open={delegateTask}
        defaultDeadline={fn_defaultDateTime()}
        onClose={() => setDelegateTask(false)}
        onSubmit={handleSubmitDelegate}
      />
	
	)}
	{addTaskModal && (
	 <AddTaskModal
        open={addTaskModal}
		defaultCurrentPlan={defaultCurrentPlan}
        defaultDateTime=''
        onClose={() => setAddTaskModal(false)}
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
