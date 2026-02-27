import React,{useState} from 'react';
import ChatPanel from './ChatPanel';


 

export default function PauleanPanel({ open, onClose, tasks, openChat }) {

const [chatTaskId,setChatTaskId]=useState('');
const [chatOpen,setChatOpen]=useState(false);

	
  return (
    <div className={`paulean-panel ${open ? 'open' : ''}`}>
      <div className="pp-header">
        <div className="pp-gem">P</div>
        <div className="pp-title">Paulean's Active Work</div>
        <div className="pp-close" onClick={onClose}>✕</div>
      </div>
      <div className="pp-sub">{tasks.length} tasks in progress · Tap any to open chat</div>
      <div className="pp-body">
        {tasks.map((t) => (
          <div key={t.taskId} className="pp-task" onClick={() => openChat(t.taskId)}>
            <div className="pp-task-row1">
              <span className={`pill ${t.done ? 'pill-d' : (t.pauleanQueued ? 'pill-q' : 'pill-a')}`}>✦ {t.pauleanQueued ? 'Queued' : (t.done ? 'Done' : 'In Progress')}</span>
              <span style={{ fontSize: 11, color: 'var(--text5)', marginLeft: 'auto' }}>{t.time || '—'}</span>
            </div>
            <div className="pp-task-title" style={{border:"none", background:"transparent"}}>{t.title} 💬</div>
          </div>
        ))}
      </div>
	   {chatOpen && (<ChatPanel open={chatOpen} chatTaskId={chatTaskId} onClose={() => setChatOpen(false)} />)}
    </div>
  );
}

/*
<div className="pp-task-desc"  >{t.desc || ''}   💬</div>
<div className="pp-open-btn">Open Chat →</div>
 <div className="pp-open-btn" title="Click to chat" style={{border:"none", background:"transparent"}}>💬</div>
*/