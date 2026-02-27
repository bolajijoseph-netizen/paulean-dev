import React, { useState, useRef, useEffect } from 'react';
import {useUserTasks} from './UserTasksContext'
import { useUserProfile } from "./UserProfileContext";

export default function ChatPanel({ open, chatTaskId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [task,setTask]=useState('');
  const [input, setInput] = useState('');
  const msgsRef = useRef();
  const {tasks,addMessage} = useUserTasks();
  const { profile} = useUserProfile();
  
  console.log(`In chatPanel with chatId ${chatTaskId}`);

  useEffect(() => {
  const task = tasks.find(t => t.taskId === chatTaskId);

  setTask(task || null);
  setMessages(task?.messages || []);
  }, [open, chatTaskId, tasks]);



/*
  function send() {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), who: 'u', text: input }]);
    setInput('');
    setTimeout(() => setMessages(m => [...m, { id: Date.now()+1, who: 'p', text: 'Got it! Working on that now. ✦' }]), 900);
  }
  */
  
  const sendMessage = () => {
	const username=profile.firstName+" "+profile.lastName;
	addMessage(chatTaskId, username,input.trim()); 
	setInput('');
  }

  return (
    <div className={`chat-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-hdr">
          <div className="chat-gem">P</div>
          <div className="chat-hdr-info">
            <div className="chat-hdr-name">Paulean</div>
            <div className="chat-hdr-task">Task: {task?.title}</div>
          </div>
          <div className="chat-x" onClick={onClose}>✕</div>
        </div>
        <div className="chat-ctx">✦ {task?.title}</div>
        <div className="chat-msgs" ref={msgsRef}>
          {messages.map((m,id) => (
            <div key={id} className={`msg ${m.who === 'p' ? 'p' : 'u'}`}>
              <div className="msg-b">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <textarea className="chat-inp" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
          <button className="chat-send" onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

/*
{
  "role": "system",
  "content": "Whenever the user references a task, assume they mean the taskId provided in the metadata."
}

{
  "taskId": "abc123",
  "message": "Mark this as urgent."
}
*/
