import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
 apiKey: "AIzaSyCMxRQJw1EYEeg7N8HumklLRYvYjXezWIU",
  authDomain: "paulean-9875f.firebaseapp.com",
  projectId: "paulean-9875f",
  storageBucket: "paulean-9875f.firebasestorage.app",
  messagingSenderId: "367770837281",
  appId: "1:367770837281:web:131e94438fcea6800fde60",
  measurementId: "G-MB2HF30MZ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db,auth };

