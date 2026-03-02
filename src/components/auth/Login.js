import { createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import '../../styles/Login.css'; 
import Modal from "../../utils/Modal";
import { useAuth } from './AuthContext';
import UserProfile from '../UserProfile';

const gProvider = new GoogleAuthProvider();


export default function Login({isOpen, onClose} ) {
	
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [newUserProfile,setNewUserProfile] = useState(false);
  const [userProfile,setUserProfile] = useState({});
  const { setUser} = useAuth();
  
  

  const handleSubmit = async (e) => {
	console.log('In handleSubmit');
	console.log(e);
	var id=e.target.id;
    try {
	  if(id=="close") {
		  onClose();
	  }
	  else
      if (id==="signIn") {
        const userCredential=await signInWithEmailAndPassword(auth, email, password);
		console.log('In signin');
		console.log(userCredential);
		onClose();
      } else if(id==="signUp") {
        await createUserWithEmailAndPassword(auth, email, password);
		onClose();
      } else if(id==="resetPassword") {
		  console.log('resetPassword:'+email);
		  await sendPasswordResetEmail(auth, email);
	  }
    } catch (err) {
      alert("Caught Error:"+err.message);
    }
  };
  
// Optional: request extra scopes
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Optional: set custom parameters
 gProvider.setCustomParameters({prompt: 'select_account'});

const signInWithGoogle= async()=> {
  try {
    const result = await signInWithPopup(auth, gProvider);
    const user = result.user;
	console.log('In ignInWithGoogle');
	console.log(user);
	onClose();
  } catch (error) {
    console.error("Error during Google sign-in:", error);
  }
}


return (
  <Modal isOpen={isOpen} onClose={onClose} onClick={(e) => e.stopPropagation()}>
    <div>
        <div>
          <span
            id="close"
            className="modal-close"
            onClick={(event) => {
              event.preventDefault();
              handleSubmit(event);
            }}
          >
            
          </span>

          <h2>Sign In to Paulean</h2>

          <div>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={userProfile.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
		  <button id="signIn" style={{ marginRight: "15px",border:"none",color:"#1a73e8" }} onClick={ (event) => {event.preventDefault();handleSubmit(event)}}>Sign In</button>
          <button id="resetPassword" style={{ marginRight: "15px",border:"none",color:"#1a73e8"}} onClick={ (event) => {event.preventDefault();handleSubmit(event)}}>Reset Password</button>
		  <button id="signUp" style={{ marginRight: "5px", border:"none",color:"#1a73e8"}} onClick={ (event) => {event.preventDefault();handleSubmit(event)}}>Sign Up</button>

          </div>

          <div>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
              <span style={{ whiteSpace: "nowrap" }}>
                <strong>Or continue with</strong>
              </span>
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
            </div>

            <div>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  signInWithGoogle();
                }}
                style={{
                  marginRight: "15px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "grey",
                  color: "white",
                }}
              >
                {/* Google SVG */}
                Google
              </button>

              <button
                style={{
                  marginRight: "15px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "grey",
                  color: "white",
                }}
              >
                {/* Facebook SVG */}
                Facebook
              </button>

              <button
                style={{
                  marginRight: "15px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "grey",
                  color: "white",
                }}
              >
                {/* Phone SVG */}
                Phone
              </button>
            </div>
          </div>
        </div>
    </div>
  </Modal>
);

}
