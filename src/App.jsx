import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/React-Router/Routes-file';
import Sidebar from "./components/Sidebar/Sidebar";
import './App.css'
import React from 'react'
import Header from "./components/Header/Header";
import SideContainer from "./components/SideContainer/SideContainer";


function App() {
  return (
    
    <Router>
        <Header/>
        <div className="container-fluid">
    
        <div className="row">

        <div className="col"><SideContainer/></div>

        <div className="col"><RoutePage /></div>
        </div>

        </div>
      
    </Router>
  )
}

export default App
