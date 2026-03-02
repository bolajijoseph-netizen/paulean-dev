import React,{useState,useEffect} from 'react';
import {useUserTasks} from './UserTasksContext'


import Login from './auth/Login';
import Logout from './auth/Logout';
import { useAuth } from './auth/AuthContext';
import UserProfile from './UserProfile';
import { useUserProfile } from "./UserProfileContext";


export default function Sidebar({ onNav, isMobile,onTogglePP, onOpenDelegate, active, onClose }) {
  
  
  const { user, loading } = useAuth();
  const { profile, profileLoading } = useUserProfile();
  const [loginClicked, setLoginClicked] = useState(false);
  const [activePauleanTasks,setActivePauleanTasks]=useState(null);
  const [pauleanTasks,setPauleanTasks]=useState(null);
  const [todayTasks,setTodayTasks]=useState(null);
  
  
  const {tasks} = useUserTasks();
  
  useEffect(() => {
	setTodayTasks(tasks.filter(t=>t.currentPlan=='today').length);
	setPauleanTasks(tasks.filter(t=>t.delegatedToPaulean).length);
	setActivePauleanTasks(tasks.filter(t=>t.delegatedToPaulean&&!t.done).length);
  }, [tasks]);
  
  const handleLoginComplete = () => {
    setLoginClicked(false);
  };
	
console.log("isMobile:", isMobile);


  return (
    <aside className={`sidebar ${isMobile?'m-open':''}`}>
		{ isMobile && (<div className="sidebar-x" onClick={onClose}>✕</div>)}
      <div className="sidebar-logo">
        <div className="logo-gem">P</div>
        <div>
          <div className="logo-text">Paulean</div>
          <div className="logo-sub">To-Done</div>
        </div>
	  </div>
		<div id="userSection"  style={{ width: "100%", marginTop: "6px", textAlign:"center" }}>
        {!user && (
          <button
            onClick={() => setLoginClicked(true)}
            className="loginLogout login"
          >
            Login / Sign Up
          </button>
        )}

        {user && (
          <button
            onClick={(e) => Logout(e)}
            className="loginLogout logout"
          >
            Log Out
          </button>
        )}
		
	  
      </div>
	  {/* 2. Not logged in → show Login */}
        {!user && loginClicked &&(
          <Login isOpen={loginClicked} onClose={handleLoginComplete} />
        )}

        {/* 3. Logged in but NO profile → show Profile form */}
        {user && !profile && (
          <UserProfile isOpen={true} onClose={handleLoginComplete} />
        )}
		

      <div className="loc-chip" onClick={() => onNav('settings')}>
        <div className="loc-dot" />
        <div className="loc-text"> Wesley Chapel, FL</div>
        <div className="loc-edit-sm">Edit</div>
      </div>

      <div className="paulean-status-btn" onClick={onTogglePP}>
        <div className="paulean-status-top">
          <div className="p-dot" />
          <div className="paulean-label">Paulean Active</div>
          <div className="paulean-count">{activePauleanTasks} active</div>
        </div>
        <div className="paulean-desc" style={{ color: 'var(--red)' }}>⚠ 1 conflict needs reply</div>
      </div>

      <div className="delegate-quick-btn" onClick={onOpenDelegate}>
        <div className="delegate-quick-icon">✦</div>
        <div>
          <div className="delegate-quick-text">Delegate to Paulean</div>
          <div className="delegate-quick-sub">Just describe it & set a deadline</div>
        </div>
      </div>

      <div className="nav-section">Views</div>
      <div className={`nav-item ${active==='board'?'active':''}`} onClick={() => onNav('board')}>⊞ Today's Board <span className="nb">{todayTasks}</span></div>
      {/*<div className={`nav-item ${active==='cal'?'active':''}`} onClick={() => onNav('cal')}>📅 Calendar</div> */}
      <div className="nav-item" onClick={onTogglePP}>✦ Paulean Tasks <span className="nb nb-blue">{pauleanTasks}</span></div>
	  {/*<div className="nav-item" onClick={() => onNav('settings')}>⚙️ Calendar & Work</div> */}

		  {/*
      <div className="nav-section">Lists</div>
      <div className="nav-item">🏠 Personal</div>
      <div className="nav-item">💼 Business</div>
		  */}

      <div className="sidebar-footer">
        <div className="user-btn">
          <div className="user-av">T</div>
          <div>
            <div className="user-name">Tolu</div>
            <div className="user-role">Personal workspace</div>
          </div>
          <div className="user-chevron">⌃</div>
        </div>
      </div>
    </aside>
  );
}


/*
<div className="sidebar-logo">
        <div className="logo-gem">P</div>
        <div>
          <div className="logo-text">Paulean</div>
          <div className="logo-sub">To-Done</div>
        </div>
		<div id="userSection"  style={{ width: "100%", marginTop: "6px" }}>
        <div>
        {!user && (
          <button
            onClick={() => setLoginClicked(true)}
            className="loginLogout"
          >
            Login / Sign Up
          </button>
        )}

        {user && (
          <button
            onClick={(e) => Logout(e)}
            className="loginLogout"
          >
            Log Out
          </button>
        )}
		
	  </div>
	  
      </div>
		
      </div>





*/