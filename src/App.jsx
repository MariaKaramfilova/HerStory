import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/Auth-Context-Provider/Auth-Countext-Provider';
import './App.css'
import RouteElement from './components/Route-Elements/RouteElement';
import Header from './components/Header/Header';
import SideBar from './components/Sidebar/Sidebar';


function App() {
  return (
    
    <Router>
      <RoutePage>
      <Header />
        <div className="container-fluid">

        <div className="row">
        <SideBar />
        <RouteElement></RouteElement>
        </div>

        </div>
        </RoutePage>
    </Router>
  )
}

export default App
