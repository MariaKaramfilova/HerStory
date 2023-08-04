import { AuthContext } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { getUserData } from '../../services/users.services';
import PropTypes from "prop-types";
import { onAuthStateChanged } from 'firebase/auth';

const RoutePage = ({ children }) => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAppState((prev) => ({...prev, user: currentUser}));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {

    if (!user) {
      return;
    }

    getUserData(user.uid).then((snapshot) => {
      if (!snapshot.exists()) {
        throw new Error('User data not found!');
      }
      setAppState((prevAppState) => ({
        ...prevAppState,
        userData: snapshot.val(Object.keys(snapshot.val())[0]),
      }));
      setLoading(false);
    });
  }, [user]);

  return (
    <div className='main-content'>
      <AuthContext.Provider value={{ ...appState, setUser: setAppState, loading }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default RoutePage

RoutePage.propTypes = {
  children: PropTypes.node.isRequired,
};