import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard'
import Navbar from './Components/Navbar';
import styles from './CSSModules/App.module.css';
import "@fontsource/poppins"; 
import "@fontsource/roboto";  
import "@fontsource/lato";
import "@fontsource/montserrat";


function App() {

  const[goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  }); 
  const [selectedGoal, setSelectedGoal] = useState(null); // track selected goal

  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);



  // update a specific goal's progress
  const updateGoal = (updatedGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
  );

  if(editGoal?.id === updatedGoal.id) {
    setEditGoal(updatedGoal);
  }

  if(selectedGoal?.id === updatedGoal.id){
    setSelectedGoal(updatedGoal);
  }
  };

  return (
    <Router>
      <div className={styles.appContainer}>
      <Navbar onCreateGoal={() => {
        setGoalFormOpen(true);
        setEditGoal(null);
        }}/>

      <div className={styles.mainContent} >
     <Routes>
       <Route path="/" element={
        <Dashboard 
         goalFormOpen={goalFormOpen}
         setGoalFormOpen={setGoalFormOpen} 
         goals={goals} 
         setGoals={setGoals}
         updateGoal={updateGoal}
         editGoal={editGoal}
         setEditGoal={setEditGoal}/>}/>
     </Routes>
      </div>

     </div>
    </Router>
  );
}

export default App