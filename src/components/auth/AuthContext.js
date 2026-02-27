// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {db, auth } from './firebaseConfig';
import { doc, getDoc } from "firebase/firestore";



const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setLoading(true);

    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    setUser(firebaseUser);
    try {
		console.log('firebaseUser');
		console.log(firebaseUser);
		
	
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
	  
     
      //if (snap.exists()) {setUser(prev => ({ ...prev, ...snap.data() }));
	  if(snap.exists()) {
		  const updatedUser={...firebaseUser,...snap.data()};
		  setUser(updatedUser);
		  console.log('In AuthContext updatedUser');
		  console.log(user); 
		  
      } else console.log('In AuthContext updatedUser No profile');
	  
	  
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
  

  return (
    <AuthContext.Provider value={{ user, setUser,loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}