import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import Dashboard from './Components/Dashboard'
import GoalForm from './Components/GoalForm'
import GoalProgress from './Components/GoalProgress'
import GoalManager from './Components/GoalManager';
import Sidebar from './Components/Sidebar'
import styles from './CSSModules/App.module.css';

function App() {

  const[goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  }); 
  const [selectedGoal, setSelectedGoal] = useState(null); // track selected goal
  const[isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const toggleSidebar = () =>{
    setIsSidebarVisible(!isSidebarVisible);
  };

  // update a specific goal's progress
  const updateGoal = (updatedGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
  );

  if(selectedGoal?.id === updatedGoal.id){
    setSelectedGoal(updatedGoal);
  }
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
       <Route path="/GoalManager" element={<GoalManager goals={goals} setGoals={setGoals} updateGoal={updateGoal}/>} />
       {/* <Route path="/GoalProgress" 
       element={selectedGoal ? <GoalProgress goal={selectedGoal} updateGoal={updateGoal} /> : <p>No goal selected</p>}/> */}
     </Routes>
      </div>

     </div>
    </Router>
  );
}

export default App