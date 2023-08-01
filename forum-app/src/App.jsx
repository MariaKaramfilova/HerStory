import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './components/React-Router/Routes-file';
import Sidebar from "./components/Sidebar/Sidebar";
import './App.css'

function App() {
  return (
    <Router>
      <Sidebar />
      <RoutePage />
    </Router>
  )
}

export default App
