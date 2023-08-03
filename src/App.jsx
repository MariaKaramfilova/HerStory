import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/React-Router/Routes-file';
import './App.css'
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";


function App() {
  return (
    
    <Router>
        <Header/>
        <div className="container-fluid">
    
        <div className="row">

        <div className="col"><SideBar/></div>

        <div className="col"><RoutePage /></div>
        </div>

        </div>
      
    </Router>
  )
}

export default App
