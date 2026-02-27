import { useState, useEffect } from 'react';
import FlightRequest from './FlightHome';
import HotelRequest from './HotelRequest';
//import addUserRequest from './addUserRequest';
import { useAuth } from './auth/AuthContext';
import { useUserRequestContext } from './UserRequestContext';
import { serverTimestamp } from 'firebase/firestore';
import ReactQuill,{ Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Save, Search, Trash, Mic, MicOff, Plus,Reply } from "lucide-react";
import {ReactComponent as SendIcon} from '../assets/send.svg';
import {ReactComponent as ShareIcon} from '../assets/share.svg';
import TaskBoard from './TaskBoard';





function UserHome() {
  const [showFlightRequest, setShowFlightRequest] = useState(true);
  const [flightRequest, setFlightRequest] = useState({});
  //const [userRequest, setUserRequest] = useState({});
  const { userRequest,setUserRequest,loadUserRequests, updateUserRequestField,saveRecord } = useUserRequestContext();
  
  const [showHotelRequest, setShowHotelRequest] = useState(false);
  const [formData, setFormData] = useState({});
  const { user} = useAuth();
  var [userId, setUserId]=useState(user.uid); //change to get userId from localStorage.
  if (!userId) setUserId(localStorage.getItem("userId"));
  
  useEffect(() => {
  const q = query(
    collection(db, "userConversations"),
    where("userId", "==", userId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      console.log("No requestNote found");
      setConversations([]);
      return;
    }

    // Extract the FIRST (and only) matching document
    const docSnap = snapshot.docs[0];
    const data = { id: docSnap.id, ...docSnap.data() };


    setRequestNote(data);
    setConversations(data.conversations || []);
  });

  return () => unsubscribe();
}, [userId]);
  
  /*
  useEffect(() => {
    setUserId(user.uid);
  }, [user]);
  */

  useEffect(() => {
    loadUserRequests(userId);
  }, [userId]);

 
  const handleFlightCheckboxChange = (event) => {
    setShowFlightRequest(event.target.checked);
  };
   const handleHotelCheckboxChange = (event) => {
    setShowHotelRequest(event.target.checked);
  };
  
  const handleDataChange = (e) => {
    const { name, type, checked} = e.target;
	const {formId}=e.target.dataset.formId;
	var value=e.target.value;
	if(type === 'checkbox' && checked) value="Y";
	if(type === 'checkbox' && !checked) value="N";
	if(formId) {
			var data=formData[formId];
			if(data) data[name]=value; else data={[name]:value};
			setFormData((prev)=>({ ...prev,[formId]:data}));
	} else if(name) setFormData((prev)=>({...prev,[name]:value}));
				
  };
 

const handleSaveRecord = () =>{
	//const now = Timestamp.fromDate(new Date());
	//if(!userRequest.createdDate) updateUserRequestField("createdDate",serverTimestamp());
	//if(!userRequest.requestDate) updateUserRequestField("requestDate",serverTimestamp());
	//saveRecord();	
}

/*
const setNoteText = (text) => {
	
console.log(`In setNoteText  text: ${text}`);
  setNotes(prev => {
    const notes = [...prev];
    notes[0] = { ...notes[0], text:text};
    return notes;
  });
}
*/

const send = () =>{}
const share = () =>{}

const initialUserRequest = () =>{
setUserRequest({
    requestTitle: 'Help Book a flight',
    description: '',
    userId: userId,
	firstName:'',
	lastName:'',
    requestType: 'flightRequest',
    flightLegs: [],
	status:'New'
  });	
}

  return (
    <div>
		<div style={{ maxHeight: 600, overflowY: "auto" }}>
			<div id={`note-toolbar-${index}`}>
				<button className="ql-bold" title="Bold" ></button>
				<button className="ql-italic" title="Italic" ></button>
				<button className="ql-underline" title="Underline"></button>
				<button className="ql-strike" title="Strike out"></button>
				<button class="ql-link"></button>
				<button class="ql-image"></button>
				{!paused && (<button title="Speak with microphone on" onClick={toggleListener} style={{border: "none"}} ><Mic size={20} /></button>)}
				{paused && (<button  title="Microphone off" onClick={toggleListener}  style={{border: "none"}} ><MicOff size={20} /></button>)}
                <button onMouseDown={() => {}} onClick={() => {saveNotes()}}  className="ql-custom-save" title="Save" disabled={!editMode}><Save size={20}  color="white" fill="green" /></button>
                <button onClick={() => send() } className="ql-custom-send" title="Send" ><SendIcon size={18}  fill="blue" /></button>
				<button onClick={() => share() } className="ql-custom-share" title="Send" ><ShareIcon size={18}  fill="blue" /></button>
             </div>
             <ReactQuill
				  ref={editorRef}
                  theme="snow"
                  value={note.text}
				  onChange={() => {}}
				  onBlur2={(range, source, editor) => {
						setNoteText(editor.getHTML());
					}}
				  onBlur={(range, source, editor) => commitEditorChanges(index, editor)}
                  modules={{
                    toolbar: { container: `#note-toolbar-${index}` }
                  }}
                />
        </div>
    </div>
  );
}

export default UserHome;

/*
The Core Idea
Every request has:
• 	One requestId
• 	One shared requestState
• 	One shared conversation history
• 	Multiple participants (creator + invited users)
Each participant can send messages, and the AI updates the same requestState.
This turns your request into a collaborative thread, not a single-user chat.
{
  "requestId": "REQ-2026-00017",

  "participants": [
    { "userId": "U001", "name": "Joseph", "role": "creator" },
    { "userId": "U002", "name": "Sarah", "role": "contributor" },
    { "userId": "U003", "name": "Michael", "role": "contributor" }
  ],

  "messages": [
    {
      "role": "user",
      "userId": "U001",
      "content": "I am creating a travel request for the team."
    },
    {
      "role": "assistant",
      "content": "Sure. Who is traveling and where?"
    },
    {
      "role": "user",
      "userId": "U002",
      "content": "I am going to NYC on March 12."
    },
    {
      "role": "user",
      "userId": "U003",
      "content": "I am going to Boston on March 14."
    }
  ],

  "currentMessage": {
    "role": "user",
    "userId": "U002",
    "content": "I prefer an evening flight."
  },

  "requestState": {
    "type": "travel",
    "group": true,
    "travelers": [
      {
        "userId": "U002",
        "name": "Sarah",
        "destination": "NYC",
        "date": "2026-03-12",
        "timePreference": "evening"
      },
      {
        "userId": "U003",
        "name": "Michael",
        "destination": "Boston",
        "date": "2026-03-14",
        "timePreference": null
      }
    ],
    "status": "incomplete"
  }
}
*/
 






