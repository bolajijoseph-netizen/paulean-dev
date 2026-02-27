import React, { createContext, useContext, useEffect, useState,useMemo } from "react";
import {collection, doc, addDoc, getDocs,setDoc,updateDoc, serverTimestamp, query, where,  onSnapshot} from "firebase/firestore";
import { db } from './auth/firebaseConfig'; // adjust path


const UserTasksContext = createContext();

export function UserTasksProvider({ userId, children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
 
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
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "userTasks"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTasks(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // ---------------------------------------------------
  // ADD TASK
  // ---------------------------------------------------
  const addTask = async (taskData) => {
    const newTask = {
	  taskId:Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
      userId:userId,
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
    const ref = doc(db, "userTasks", taskId);
    await updateDoc(ref, updated);
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
    if (!task) return;
    task.currentPlan=newPlan;
    await updateTask(task.taskId, task);
	
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
  try {
    // Build a query to get all flightRequests for this userId
    const q = query(collection(db, 'userTasks'), where('userId', '==', user.uid));
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
      console.log("No tasks found for userId:", userId);
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
        addMessage,
		delegateTask,
		loadUserTasks,
		latestMessage,
		latestTaskId,
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
*/	  
	  