import { AuthContext } from '../../context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import PropTypes from "prop-types";
import { onAuthStateChanged } from 'firebase/auth';

const RoutePage = ({ children }) => {
  // const [user] = useAuthState(auth);
  const { user } = useContext(AuthContext);
  const [appState, setAppState] = useState({user});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAppState((prev) => ({...prev, user: currentUser}));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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