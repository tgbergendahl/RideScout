// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth, db } from '../firebase'; // Ensure this import is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCertifiedSeller, setIsCertifiedSeller] = useState(false);
  const [isSuperCertifiedSeller, setIsSuperCertifiedSeller] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'RideScout/Data/Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsCertifiedSeller(userData.isCertifiedSeller || false);
          setIsSuperCertifiedSeller(userData.isSuperCertifiedSeller || false);
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isCertifiedSeller, isSuperCertifiedSeller }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
