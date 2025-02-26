import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import Dashboard from './Components/Dashboard'
import GoalProgress from './Components/GoalProgress'
import Navbar from './Components/Navbar';
import styles from './CSSModules/App.module.css';

function App() {

  const[goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  }); 
  const [selectedGoal, setSelectedGoal] = useState(null); // track selected goal

  const [goalFormOpen, setGoalFormOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);



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
      <Navbar onCreateGoal={() => setGoalFormOpen(true)}/>

      <div className={styles.mainContent} >
     <Routes>
       <Route path="/" element={<Dashboard goalFormOpen={goalFormOpen} setGoalFormOpen={setGoalFormOpen} goals={goals} updateGoal={updateGoal}/>}/>
     </Routes>
      </div>

     </div>
    </Router>
  );
}

export default App