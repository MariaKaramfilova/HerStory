import { AuthContext } from '../../context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import PropTypes from "prop-types";
import { onAuthStateChanged } from 'firebase/auth';
import { getAllUsers, getUserData } from '../../services/users.services.js';

const RoutePage = ({ children }) => {
  const { user, loggedInUser } = useContext(AuthContext);
  const [appState, setAppState] = useState({ user, loggedInUser });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      (async () => {
        const allUsers = await getAllUsers();

        if (currentUser) {
          const loggedUserSnapshot = await getUserData(currentUser.uid);
          const loggedInUser = Object.values(loggedUserSnapshot.val()).find((el) => el.uid === currentUser.uid);
          setAppState((prev) => ({ ...prev, loggedInUser, user: currentUser, allUsers }));
        } else {
          setAppState((prev) => ({ ...prev, loggedInUser: currentUser, user: currentUser, allUsers }));
        }
      })();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='main-content'>
      <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default RoutePage

RoutePage.propTypes = {
  children: PropTypes.node.isRequired,
};