import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Sign in existing user
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out current user
  function logout() {
    return signOut(auth);
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Persist user to localStorage
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email,
      }));
    } else {
      localStorage.removeItem('user');
    }

    return unsubscribe;
  }, [currentUser]);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !currentUser) {
      const parsedUser = JSON.parse(storedUser);
      // Just update state with basic info - will be overwritten once onAuthStateChanged fires
      setCurrentUser(parsedUser);
    }
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}