import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

export default function Logout() {
console.log('Doing Logout');
const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
        // Optionally redirect or update UI here
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
	return handleLogout();
}