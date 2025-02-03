import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import Dashboard from './Components/Dashboard'
import GoalForm from './Components/GoalForm'
import ProgressVisualization from './Components/ProgressVisualization'
import Sidebar from './Components/Sidebar';
import styles from './CSSModules/App.module.css'

function App() {

  const[goals, setGoals] = useState([]); //shared state to hold data
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

      <div className={`${styles.mainContent} ${isSidebarVisible ? styles.shiftRight : ""}`}>
     <Routes>
       <Route path="/" element={<Dashboard goals={goals}/>}/>
       <Route path="/create-goal" element={<GoalForm setGoals={setGoals}/>}/>
       <Route path="/progress" element={<ProgressVisualization/>}/>
     </Routes>
      </div>

     </div>
    </Router>
  );
}

export default App