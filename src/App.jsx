import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/Auth-Context-Provider/Auth-Countext-Provider';
import './App.css'
import RouteElement from './components/Route-Elements/RouteElement';
import Header from './components/Header/Header';
import SideBar from './components/Sidebar/Sidebar';
import "react-loading-skeleton/dist/skeleton.css";
import { ThemeContext } from './context/ThemeContext.js';

function App() {
  const [theme, setTheme] = useState('light');

  return (

    <Router>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`theme-${theme}`}>
     
            <RoutePage>
              <Header />
              <div className="container-fluid">

                <div className="row">

                  <div className="col-3">
                    <SideBar />
                  </div>

                  <div className="col">
                    <RouteElement></RouteElement>
                  </div>

                </div>

              </div>
            </RoutePage>
   
        </div>
      </ThemeContext.Provider>
    </Router>
  )
}

export default App
