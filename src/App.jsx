import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/Auth-Context-Provider/Auth-Countext-Provider';
import './App.css'
import RouteElement from './components/Route-Elements/RouteElement';
import Header from './components/Header/Header';
import SideBar from './components/Sidebar/Sidebar';
import "react-loading-skeleton/dist/skeleton.css";
import PostsContextProvider from './components/PostsContextProvider/PostsContextProvider.jsx';

function App() {

  return (

    <Router>
      <PostsContextProvider>
        <RoutePage>
          <Header />
          <div className="container-fluid">

            <div className="row">

          <div className="col-1" style={{ backgroundColor: '#f8f9fa', width: '25%', margin: 0  }}>
          {/* Put content for the right column here */}
              <SideBar/>
        </div>

            <div className="col">
              <RouteElement />
            </div>
            
          </div>

          </div>
        </RoutePage>
      </PostsContextProvider>
    </Router>
  )
}

export default App
