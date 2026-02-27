import React,{ useState}  from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useAuth } from './auth/AuthContext';
import Modal from "../utils/Modal";

export default function UserProfile({isOpen, onClose }) {

const { user, setUser} = useAuth();	
const [userProfile,setUserProfile]=useState({roles: ["user"]});
	
const saveUserProfile = async () => {
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
	 uid:user.uid,
    ...userProfile,
    phone: userProfile.phoneNumber || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  setUser(prev => ({ ...prev,...userProfile}));
  //onSave();
};

const updateUserProfile = (field,value) =>{
	 setUserProfile((prev) =>({...prev,[field]:value})); 
  }

return(
<Modal isOpen={isOpen} onClose={onClose} onClick={(e) => e.stopPropagation()} >
<div>
          <div >
		  <h4>Tell us just your basic information</h4>
            <label>First Name:</label>
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              value={userProfile.firstName}
              onChange={(e) => updateUserProfile(e.target.id, e.target.value)}
              required
            />
          </div>

          <div>
            <label>Last Name:</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={userProfile.lastName}
              onChange={(e) => updateUserProfile(e.target.id, e.target.value)}
              required
            />
          </div>

          <div>
            <label>Phone number:</label>
            <input
              id="phoneNumber"
              type="text"
              value={userProfile.phoneNumber}
              onChange={(e) => updateUserProfile(e.target.id, e.target.value)}
              required
            />
          </div>
          <button onClick={saveUserProfile}>Save</button>
 </div>
 </Modal>
 );
		
}
