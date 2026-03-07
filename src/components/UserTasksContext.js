import React, { createContext, useContext, useEffect, useState,useMemo } from "react";
import {collection, doc, addDoc, getDocs,setDoc,updateDoc,deleteDoc,Timestamp, serverTimestamp, query, where,  onSnapshot} from "firebase/firestore";
import { db } from './auth/firebaseConfig'; // adjust path
import { useAuth } from "./auth/AuthContext";


const UserTasksContext = createContext();

export function UserTasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();
  const {userId, setUserId } = useState(null);


 
   // ---------------------------------------------------
  // EXPOSE LATEST MESSAGE
  // ---------------------------------------------------
  const { latestMessage, latestTaskId } = useMemo(() => {
  // Flatten all messages with their taskId
  const allMessages = tasks.flatMap(t =>
    (t.messages || []).map(m => ({
      ...m,
      taskId: t.taskId
    }))
  );

  if (allMessages.length === 0) {
    return {
      latestMessage: null,
      latestTaskId: null
    };
  }

  // Find the latest message
  /*
  const latest = allMessages.reduce((latest, m) => {
    const created = new Date(m.createdDate);
    if (!latest) return m;
    return created > new Date(latest.createdDate) ? m : latest;
  }, null);
  */
  
  var latest=null;
  var latestDate=null;
  allMessages.forEach((m,idx) =>{
	   if(idx==0) {
		   latest=m;
		   latestDate=m.createdDate;
	   }
	   else if(m.createdDate>latestDate){ latest=m;
	                                      latestDate=m.createdDate;
										}
		})
  return {
    latestMessage: latest.text,
    latestTaskId: latest.taskId
  };
}, [tasks]);

  

  // ---------------------------------------------------
  // REAL-TIME SUBSCRIPTION
  // ---------------------------------------------------
  // ---------------------------------------------------
  // REAL-TIME SUBSCRIPTION
  // ---------------------------------------------------
  useEffect(() => {
  if (!user?.uid) {
    setTasks([]);
    return;
  }

  const q = query(
    collection(db, "userTasks"),
    where("userId", "==", user.uid),
	where('deleted', '==', false)
  );


	
  const unsubscribe = onSnapshot(q, (snapshot) => {
  const list = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // DESC

    setTasks(list);
	console.log("Task set again");
	console.log(list);
    setLoading(false);
  });

  return () => unsubscribe();
}, [user?.uid]);


  // ---------------------------------------------------
  // ADD TASK
  // ---------------------------------------------------
  const addTask = async (taskData) => {
    const newTask = {
	  taskId:Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
      userId:user.uid,
      username: taskData.username || "",
      createdDate: serverTimestamp(),
      currentPlan: taskData.currentPlan || "today",
      delegatedToPaulean: taskData.delegatedToPaulean || false,
      duration: taskData.duration || 0,
	  notes:taskData.notes,
      messages: [],
      status: taskData.status || "pending",
      urgent: taskData.currentPlan=='urgent'?true:taskData.urgent || false,
	  percentComplete:0,
	  done:false,
	  deleted:false,
      ...taskData
    };

	const ref = doc(db, "userTasks", newTask.taskId); // use taskId as the doc ID
	await setDoc(ref, newTask);

	return newTask.taskId;

  };

  // ---------------------------------------------------
  // UPDATE TASK
  // ---------------------------------------------------
  
  const updateTask = async (taskId, updated) => {
  try {
    const ref = doc(db, "userTasks", taskId);
    await updateDoc(ref, updated);
	
  } catch (e) {
    console.error(`Error updating task ${taskId}:`, e);
  }
};

 // ---------------------------------------------------
  // DELETE TASK
  // ---------------------------------------------------
const deleteTask = async (task) => {
	if (!task) return;
  try {
	//await deleteDoc(doc(db, "userTasks", taskId));
	task.deleted=true;
	task.deletedDate=new Date(); 
	await updateTask(task.taskId, task);
  } catch (e) {
    console.error(`Error deleting task ${task.taskId}:`, e);
  }
};

// ---------------------------------------------------
  // UNDO DELETE TASK
  // ---------------------------------------------------
const undoDeleteTask = async (task) => {
	if (!task) return;
  try {
	//await deleteDoc(doc(db, "userTasks", taskId));
	task.deleted=false;
	task.deletedDate=null; 
	await updateTask(task.taskId, task);
  } catch (e) {
    console.error(`Error und delete task ${task.taskId}:`, e);
  }
};


  // ---------------------------------------------------
  // TOGGLE URGENT
  // ---------------------------------------------------
  const toggleUrgent = async (task) => {
    if (!task) return;

   task.urgent=!task.urgent;
    await updateTask(task.taskId, task);
  };

  // ---------------------------------------------------
  // TOGGLE DONE (status)
  // ---------------------------------------------------
  const toggleDone = async (task) => {
    //const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    //const newStatus = task.status === "done" ? "pending" : "done";
	task.done=!task.done
    await updateTask(task.taskId, task);
  };

  // ---------------------------------------------------
  // MOVE TASK TO ANOTHER PLAN
  // ---------------------------------------------------
  const moveTaskTo = async (task, newPlan) => {
	 console.log("moveTaskTo called");
    if (!task) return;
    task.currentPlan=newPlan;
    await updateTask(task.taskId, task);
	
  };
  
  // ---------------------------------------------------
  // MOVE TASK TO ANOTHER TIME
  // ---------------------------------------------------
  const moveTaskTime = async (task, dateTime) => {
  if (!task) return;

  //const dt= new Date("2026-02-28T08:30");
  //const updated ={...task,dateTime:"2026-02-28T08:30"};

  const updated = {
    ...task,
	dateTime:dateTime
  }; 
  
    await updateTask(task.taskId, updated);
  };



  // ---------------------------------------------------
  // ADD MESSAGE TO TASK
  // ---------------------------------------------------
  const addMessage = async (taskId, fromUser, text) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newMessage = {
      createdDate: new Date(),
      fromUser,
      text
    };

    const updatedMessages = [...(task.messages || []), newMessage];

    await updateTask(taskId, { messages: updatedMessages });
  };
  
  // ---------------------------------------------------
  // DELEGATE TASK TO Paulean
  // ---------------------------------------------------
  const delegateTask = async (task) => {
     task.delegatedToPaulean=true;
    await updateTask(task.taskId, task);
  };
  
  // NEW: Load a request from Firestore
  const loadUserTasks = async (user) => {
	  if(!user) return;
  try {
    // Build a query to get all flightRequests for this userId
    const q = query(collection(db, 'userTasks'), 
	where('userId', '==', user.uid),
	where('deleted', '==', false)
	)
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Collect all matching requests
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
	  
	  setTasks(tasks);
      console.log("User tasks loaded:", tasks);
	 										
    } else {
      console.log("No tasks found for user");
    }
  } catch (err) {
    console.error("Error loading User tasks:", err);
  }
};



  // ---------------------------------------------------
  // EXPOSE CONTEXT API
  // ---------------------------------------------------
  return (
    <UserTasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        toggleUrgent,
        toggleDone,
        moveTaskTo,
		moveTaskTime,
        addMessage,
		delegateTask,
		loadUserTasks,
		latestMessage,
		latestTaskId,
		deleteTask,
		undoDeleteTask
      }}
    >
      {children}
    </UserTasksContext.Provider>
  );
}

export function useUserTasks() {
  return useContext(UserTasksContext);
}


/*
 var latestCreatedDate=null;
	  var messageCreatedDate=null;
	  tasks.forEach(t=> {
		                 t.messages.forEach(m=>{if(!latestCreatedDate) {
													latestCreatedDate=new date(m.createdDate);
													latestMessage=m.text;
													}
						                        messageCreatedDate=new Date(m.createdDated);
												latestMessage=messageCreatedDate>latestCreatedDate:m.text:latestMessage;
						 })
	  })
// ---------------------------------------------------
  // UPDATE TASK
  // ---------------------------------------------------	  
const updateTask = async (taskId, updated) => {
	try {
    const ref = doc(db, "userTasks", taskId);
    await updateDoc(ref, updated);
	console.log(`Succesfully updated ${updated.dateTime}`);
	} catch(e){
		console.log(`Error with updateDoc ${e}`);
	}
  };
  
*/	  
	  
