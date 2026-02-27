import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db} from '../firebaseConfig';
import { useAuth } from "./auth/AuthContext";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const { user, authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // Not logged in → no profile
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    // Logged in → check Firestore
    const ref = doc(db, "users", user.uid);

    getDoc(ref).then((snap) => {
      setProfile(snap.exists() ? snap.data() : null);
      setProfileLoading(false);
    });
  }, [user, authLoading]);

  return (
    <UserProfileContext.Provider value={{ profile, profileLoading }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}