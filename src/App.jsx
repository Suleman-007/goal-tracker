import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import Dashboard from './Components/Dashboard'
import GoalForm from './Components/GoalForm'
import ProgressVisualization from './Components/ProgressVisualization'
import Sidebar from './Components/Sidebar';
import styles from './CSSModules/App.module.css'

function App() {

  const[isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () =>{
    setIsSidebarVisible(!isSidebarVisible);
  };



  return (
    <Router>
      <div className={styles.appContainer}>
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar}/>
      <button className={styles.toggleButton}
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      <div className={styles.mainContent}>
     <Routes>
       <Route path="/" element={<Dashboard/>}/>
       <Route path="/create-goal" element={<GoalForm/>}/>
       <Route path="/progress" element={<ProgressVisualization/>}/>
     </Routes>
      </div>

     </div>
    </Router>
  );
}

export default App