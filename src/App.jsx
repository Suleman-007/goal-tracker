import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard'
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import styles from './CSSModules/App.module.css';
import "@fontsource/poppins"; 
import "@fontsource/roboto";  
import "@fontsource/lato";
import "@fontsource/montserrat";

function App() {
  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem("goals");
      return savedGoals ? JSON.parse(savedGoals) : [];
    } catch (error) {
      console.error("Error loading goals from localStorage:", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState(""); // 🔍 NEW: Search bar state

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [recurringFilterOn, setRecurringFilterOn] = useState(false);



  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

  const updateGoal = useCallback((updatedGoal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === updatedGoal.id && JSON.stringify(goal) !== JSON.stringify(updatedGoal)
          ? updatedGoal
          : goal
      )
    );

    if (editGoal?.id === updatedGoal.id && JSON.stringify(editGoal) !== JSON.stringify(updatedGoal)) {
      setEditGoal(updatedGoal);
    }

    if (selectedGoal?.id === updatedGoal.id && JSON.stringify(selectedGoal) !== JSON.stringify(updatedGoal)) {
      setSelectedGoal(updatedGoal);
    }
  }, [editGoal, selectedGoal]);

  return (
    <Router>
      <div className={styles.appContainer}>
        <Navbar 
          onCreateGoal={() => {
            setGoalFormOpen(true);
            setEditGoal(null);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} 
          recurringFilterOn={recurringFilterOn}
          setRecurringFilterOn={setRecurringFilterOn}// 🔍 NEW
        />

        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={
              <Dashboard
                goalFormOpen={goalFormOpen}
                setGoalFormOpen={setGoalFormOpen}
                goals={goals}
                setGoals={setGoals}
                updateGoal={updateGoal}
                editGoal={editGoal}
                setEditGoal={setEditGoal}
                searchQuery={searchQuery}
                recurringFilterOn={recurringFilterOn} // 🔍 NEW
              />
            } />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
