import {Routes, Route} from 'react-router-dom';
import Home from '../../views/Home/Home';
import About from '../../views/About/About';
import CreatePost from '../CreatePost/CreatePost.jsx';
import RegistrationForm from '../SignUp/SignUp';
import { AuthContext } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { getUserData } from '../../services/users.services';
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute';
import Login from '../Login/Login.jsx';

const RoutePage = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
  })

  if (appState.user !== user) {
    setAppState({user})
  }
  useEffect(() => {
    if (user === null) {
      return
    }
    getUserData(user.uid)
    .then(snapshot => {
      if (!snapshot.exists()) {
        throw new Error('User data not found!')
      }
      setAppState({
        ...appState,
        userData: snapshot.val(Object.keys(snapshot.val())[0])
      })
    },[user])
  })
    return (
      <div className='main-content'>
        <AuthContext.Provider value =  {{...appState, setUser: setAppState}}>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AuthenticatedRoute><About /></AuthenticatedRoute>} />
            <Route path="/sign-up" element={<RegistrationForm />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/create-post" element={<CreatePost />} />
        </Routes>
        </AuthContext.Provider>
      </div>
    );
};

export default RoutePage