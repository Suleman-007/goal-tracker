import React, { useEffect, useState } from 'react'
import styles from '../CSSModules/Dashboard.module.css'
import { GoGoal } from "react-icons/go";
import {FaEdit, FaTrash, FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaBullseye, FaChartBar, FaClock} from "react-icons/fa";
import GoalProgress from './GoalProgress';
import GoalForm from './GoalForm';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function Dashboard({goalFormOpen, setGoalFormOpen}) {
  const [goals, setGoals] =useState([]);
  const [editGoal, setEditGoal] = useState(null);
  // state to track which goal's progress form is open
  const [progressFormOpen, setProgressFormOpen] = useState(null);
  const [modalGoal, setModalGoal] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);

  // state to hadle showing more goals
  const [showAllGoals, setShowGoals] = useState(false);

  // store completion percentage and days remaining for each goal
  const [goalProgressData, setGoalProgressData] = useState({});

  // limit number of goals displayed initially
  const displayedGoals = showAllGoals ? goals : goals.slice(0, 4);

  useEffect(() =>{
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(savedGoals);
  }, []);

  // Save goals to local storage whenever they change
  useEffect(() =>{
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const updateGoals = (updatedGoal, isProgressUpdate = false) => {
    setGoals((prevGoals) =>{
      if(updatedGoal.id && prevGoals.some(goal => goal.id === updatedGoal.id)){
        // update existing goal
        return prevGoals.map((goal) => 
          (goal.id === updatedGoal.id ? updatedGoal : goal));
          
        } else {

        // create new goal
        return [...prevGoals, { ...updatedGoal, id:Date.now()}];
      }
    });
      
    setGoalFormOpen(false);
    setEditGoal(null);
  };

  const deleteGoal = (goalId) => {
    if(window.confirm("Are you want to delete this goal?")){
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      toast.error("Goal deleted!");
    }
  };
  
  const calculateDaysRemaining = (goal) => {
    if(!goal.endDate) return'N/A';

    const end = new Date(goal.endDate);
    let lastProgressDate = null;
    
    if(goal.progressLogs && goal.progressLogs.length > 0) {
      const validLogs = goal.progressLogs.filter(log => log.date && !isNaN(new Date(log.date).getTime()));
      if(validLogs.length > 0){
       validLogs.sort(
         (a, b) => new Date(b.date) - new Date(a.date));
         lastProgressDate = new Date(validLogs[0].date);

    }
  }



  if(!lastProgressDate){
    lastProgressDate = new Date(goal.startDate);
  }


    if(isNaN(lastProgressDate.getTime())){
      console.error(`invalid date for goal: ${goal.title}`, goal.progressLogs);
      return 'N/A';
    }

    const daysLeft = Math.ceil((end - lastProgressDate) / (1000*60*60*24));

    console.log(`Goal: ${goal.title}, Days Left:`, daysLeft);

    return daysLeft >= 0 ? daysLeft : 0;

  };

  useEffect(() => {
    const updatedCompletionPerentage = {};

    goals.forEach((goal) => {
      
      const totalProgress = goal.progressLogs?.reduce((acc, log) => acc + parseInt(log.amount, 10), 0) || 0;
      const completionPercentage = goal.targetAmount > 0 ? (totalProgress / goal.targetAmount)*100 : 0;
      updatedCompletionPerentage[goal.id] = completionPercentage;
    });

    setGoalProgressData(updatedCompletionPerentage);
  }, [goals]);
  // update goal progress when new progress is logged
  const handleProgressData = (goalId, completionPercentage) => {
    setGoalProgressData((prevData) => ({
      ...prevData,
     [goalId]: completionPercentage,
    }));
  };


  return (
    <div className={styles.dashContainer}>
      <h1>Time-Based Goal Tracker <GoGoal /></h1>
      <p>Welcome to your Goal Tracker!</p>

      {/*Create New Goal Button*/}
      <button className={styles.primaryBtn} onClick={() =>{ setEditGoal(null); setGoalFormOpen(true)}} >
        <FaPlus/> Create New Goal
      </button>

      {/*Display Goal Form if Open*/}
      {goalFormOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
        <GoalForm
        setGoals={setGoals}
        closeForm={() => setGoalFormOpen(false)}
        editGoal={editGoal}
        />
        <button className={styles.closeIcon} onClick={() => setGoalFormOpen(false)}> <FaTimes/> </button>
        </div>
        </div>
      )}

    {/*Display Goals*/}
    <div>
    <h2>Your Goals</h2>
    <p>You have <strong>{goals.length}</strong> goals.</p>
    {goals.length === 0 ? (
      <p>No Goals yet!</p>
    ) : (
      <div className={styles.goalCardContainer}>
      { displayedGoals.map((goal) => {
        // Get completion percentage from state
        const completionPercentage = goalProgressData[goal.id] || 0;
        const daysRemaining = calculateDaysRemaining(goal);

        return (
        <div key={goal.id} className={styles.goalCard}>
          <h3>{goal.title}</h3>
          <div className={styles.actionIcons}>
          <FaEdit className={styles.eitIcon} onClick={() => {setEditGoal(goal); setGoalFormOpen(true); }}/>
          <FaTrash className={styles.deleteIcon} onClick={() => deleteGoal(goal.id)}/>
          </div>
          
          <div className={styles.infoContainer}>
            <div className={`${styles.infoBadge} ${styles.targetBadge}`}>
            <FaBullseye/>
            <span>Target {goal.goalType === 'sessions' ? 'Sessions' : 'Hours'}: {goal.targetAmount}</span>
            </div>

          <div className={`${ styles.infoBadge} ${styles.progressBadge}`}>
            <FaChartBar/>
            Progress: {completionPercentage !== undefined ? completionPercentage.toFixed(1) : 'N/A'}%
            </div>

          <div className={`${styles.infoBadge} ${styles.daysBadge}`}>
            <FaClock/>
            Days Remaining: {daysRemaining !== undefined ? daysRemaining : 'N/A'} days
            </div>
          </div>
          {/*Log Progress Button*/}
          <button className={styles.secondaryBtn} onClick={() => setProgressFormOpen(progressFormOpen === goal.id ? null : goal.id)}>
            {progressFormOpen === goal.id ? <FaChevronUp/> : <FaChevronDown/>} Log Progress
          </button>

          {/* Show Log Progress Form if open */}
          {progressFormOpen === goal.id && (
           <GoalProgress goal={goal}
            updateGoal={(updatedGoal) => updateGoals(updatedGoal, true)} 
            hideForm={() => setProgressFormOpen(null)}
            onlyLogForm={true} // New prop to show only the log form
            />
          )}

          {/*show progress button (opens modal)*/}
          <button className={styles.primaryBtn}onClick={() => setModalGoal(goal)}>
            Show Progress
          </button>

        </div>
      );
    })}
    </div> /*End of goalCardsContainer*/
  )}
    </div>

      {/*Show More Button*/}
      {goals.length > 4 && (
        <button
         className={styles.showMoreBtn}
         onClick={() => setShowGoals(!showAllGoals)}
         >
          {showAllGoals ? "Show Less Goals" : "Show All Goals"}
        </button>
      )}

      {/* Modal for showing progress graph & history */}
      {modalGoal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <GoalProgress
            goal={modalGoal}
            updateGoal={updateGoals}
            onlyLogForm={false}
            />
            <button className={styles.closeIcon} onClick={() => setModalGoal(null)}>
              <FaTimes/>
            </button>
          </div>
        </div>
      )}

      <div className={styles.guideBar}>
      <p> Use this sidebar to:</p>
        <ul>
          <li>Create new goals</li>
          <li>View and track your existing goals</li>
        </ul>
      </div>

      <p>Get Started by creating a new goal or check your GoalProgress on existing ones!</p>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable/>
    </div>
  );
}

export default Dashboard