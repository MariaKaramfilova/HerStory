import { AuthContext } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { getUserData } from '../../services/users.services';

const RoutePage = ({children}) => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
  })

  useEffect(() => {
    if (user === null) {
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
    });
  }, [user]);
    return (
      <div className='main-content'>
        <AuthContext.Provider value =  {{...appState, setUser: setAppState}}>
          {children}
        </AuthContext.Provider>
      </div>
    );
};

export default RoutePage