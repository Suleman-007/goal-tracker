import React, { useEffect, useState } from 'react'
import styles from '../CSSModules/Dashboard.module.css'
import { GoGoal } from "react-icons/go";
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaBullseye, FaChartBar, FaRegClock, FaRedo, FaTimes} from "react-icons/fa";
import GoalProgress from './GoalProgress';
import GoalForm from './GoalForm';
import LandingState from './LandingState';
import OverallProgress from "./OverallProgress";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function Dashboard({goalFormOpen, setGoalFormOpen, searchQuery, recurringFilterOn, setRecurringFilterOn}) {
  const [editGoal, setEditGoal] = useState(null);
  const [modalGoal, setModalGoal] = useState(null);
  const [logProgressGoal, setLogProgressGoal] = useState(null);
  const [showAllGoals, setShowGoals] = useState(false);
  const [goalProgressData, setGoalProgressData] = useState({});
  const [goals, setGoals] = useState(() => {
    const storedGoals = localStorage.getItem("goals");
    return storedGoals ? JSON.parse(storedGoals) : [];
  });
  const [resetDetails, setResetDetails] = useState([]); // ✅ Store reset details
  const [showNotification, setShowNotification] = useState(false);
  const [sortOption, setSortOption] = useState(() => localStorage.getItem("sortOption") || ""); 
  const [sortOrder, setSortOrder] = useState(() => localStorage.getItem("sortOrder") || "asc");

useEffect(() => {
  localStorage.setItem("sortOption", sortOption);
  localStorage.setItem("sortOrder", sortOrder);
}, [sortOption, sortOrder]);



  let sortedGoals = [...goals]; // Clone original goals

if (sortOption) {
  sortedGoals.sort((a, b) => {
    let aValue, bValue;

    switch (sortOption) {
      case "progress":
        aValue = goalProgressData[a.id] || 0;
        bValue = goalProgressData[b.id] || 0;
        break;

      case "priority":
        const priorityMap = { high: 1, medium: 2, low: 3, default: 4 };
        aValue = priorityMap[a.priority] || 4;
        bValue = priorityMap[b.priority] || 4;
        break;

      case "deadline":
        aValue = new Date(a.endDate);
        bValue = new Date(b.endDate);
        break;

      case "created":
        aValue = a.id;
        bValue = b.id;
        break;

      default:
        return 0;
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });
}

let filteredGoals = [...sortedGoals];

if (searchQuery.trim() !== "") {
  filteredGoals = filteredGoals.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

if (recurringFilterOn) {
  filteredGoals = filteredGoals.filter(
    (goal) => goal.recurringType && goal.recurringType !== "None"
  );
}

const displayedGoals = showAllGoals ? filteredGoals : filteredGoals.slice(0, 4);

  const resetRecurringGoals = () => {
    const today = new Date();
    let resetOccurred = false;
    let resetInfo = [];

    const updatedGoals = goals.map((goal) => {
        if (!goal.recurringType || goal.recurringType === "None") return goal;

        const endDate = new Date(goal.endDate);
        if (today > endDate) {
            resetOccurred = true;
            resetInfo.push({ title: goal.title, type: goal.recurringType });

            let newStartDate = new Date(today); // Reset to today
            let newEndDate = new Date(newStartDate); // Clone newStartDate

            switch (goal.recurringType) {
                case "Daily":
                    newEndDate.setDate(newEndDate.getDate() + 1);
                    break;
                case "Weekly":
                    newEndDate.setDate(newEndDate.getDate() + 7); // ✅ This ensures it moves to the next month if needed
                    break;
                case "Monthly":
                    newEndDate.setMonth(newEndDate.getMonth() + 1);
                    break;
                case "Yearly":
                    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                    break;
                default:
                    break;
            }

            console.log(`🔄 Resetting: ${goal.title}`);
            console.log("📅 New Start Date:", newStartDate.toISOString().split('T')[0]);
            console.log("📅 New End Date:", newEndDate.toISOString().split('T')[0]);

            return {
                ...goal,
                progressLogs: [], 
                startDate: newStartDate.toISOString().split('T')[0],
                endDate: newEndDate.toISOString().split('T')[0], // ✅ Now correctly updates
                lastReset: today.toISOString().split('T')[0], // ✅ Tracks last reset date
            };
        }
        return goal;
    });

    if (resetOccurred) {
        setResetDetails(resetInfo);
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    }

    setGoals([...updatedGoals]); // ✅ Ensure state updates correctly
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    console.log("✅ Updated Goals After Reset:", updatedGoals);
};


  
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(savedGoals);
  
    setTimeout(() => {  // ✅ Ensure reset runs AFTER goals are loaded
      resetRecurringGoals();
    }, 100);
  }, []);
  

  useEffect(() => {
    if (goals.length > 0) {
      console.log("Saving goals to localStorage:", goals);
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);
  

  useEffect(() => {
    if(goalFormOpen) {
      setEditGoal(null);
    }
  }, [goalFormOpen]);

  const updateGoals = (updatedGoal) => {
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
    const updatedCompletionPercentage  = {};

    goals.forEach((goal) => {
      
      const totalProgress = goal.progressLogs?.reduce((acc, log) => acc + parseInt(log.amount, 10), 0) || 0;
      const completionPercentage = goal.targetAmount > 0 ? (totalProgress / goal.targetAmount)*100 : 0;
      updatedCompletionPercentage [goal.id] = completionPercentage;
    });

    setGoalProgressData(updatedCompletionPercentage );
  }, [goals]);
  // update goal progress when new progress is logged
  const handleProgressData = (goalId, completionPercentage) => {
    setGoalProgressData((prevData) => ({
      ...prevData,
     [goalId]: completionPercentage,
    }));
  };

  const resetProgress = (goalId) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, progressLogs: [] } : goal
      )
    );
    toast.info("Progress reset for this recurring goal!");
  };
  

  return (
    <div className={styles.dashContainer}>

     {/* ✅ Notification with singular/plural correction */}
{showNotification && resetDetails.length > 0 && (
  <div className={styles.notification}>
    <strong>🔄 {resetDetails.length} {resetDetails.length === 1 ? "goal" : "goals"} reset:</strong>
    <ul>
      {resetDetails.map((goal, index) => (
        <li key={index}>{goal.title} ({goal.type})</li>
      ))}
    </ul>
    <button onClick={() => setShowNotification(false)}><FaTimes/></button>
  </div>
)}
      <h1>Welcome to your Goal Tracker!<GoGoal/></h1>

      {/*Goal Form Modal*/}
      {goalFormOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
        <GoalForm
        setGoals={setGoals}
        goals={goals}
        closeForm={() => {
          setGoalFormOpen(false);
          setEditGoal(null);
        }}
        editGoal={editGoal}
        />
        </div>
        </div>
      )}
       {/* <OverallProgress goals={goals} /> */}

  {/* Display Goals */}
<div>
  {goals.length > 0 && (
    <>
      <h2>Your Goals</h2>
      <div className={styles.goalMeta}>
        <p>You have <strong>{goals.length}</strong> goals.</p>
        <div className={styles.sortControls}>
          <label>Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortDropdown}
          >
            <option value="">None</option>
            <option value="progress">Progress</option>
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="created">Date Created</option>
          </select>

          {/* Toggle Asc/Desc Order */}
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className={styles.sortOrderToggle}
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
      </div>
    </>
  )}

  {goals.length === 0 && !goalFormOpen ? (
    <LandingState setGoalFormOpen={setGoalFormOpen} />
  ) : (
    <div className={styles.goalCardContainer}>
      {displayedGoals.map((goal) => {
        const completionPercentage = goalProgressData[goal.id] || 0;
        const daysRemaining = calculateDaysRemaining(goal);

        return (
          <div
            key={goal.id}
            className={`${styles.goalCard} ${
              goal.priority === "high" ? styles.highPriority : styles.defaultPriority
            }`}
          >
            {/* 🔥 High Priority Badge */}
            {goal.priority === "high" && (
              <span className={styles.priorityBadge}>🔥 High Priority</span>
            )}

            <div className={styles.goalHeader}>
              {/* Left Section: Title + Recurring Icon */}
              <h3
                className={`${styles.goalTitle} ${
                  goal.recurringType && goal.recurringType !== ""
                    ? styles.recurringTitle
                    : ""
                }`}
                title={goal.title}
              >
                {goal.title.length > 20
                  ? `${goal.title.substring(0, 20)}...`
                  : goal.title}
              </h3>

              {/* Right Section: Actions */}
              <div className={styles.actionIcons}>
                {goal.recurringType && (
                  <FaRedo
                    className={styles.resetIcon}
                    title={`Reset Progress (${goal.recurringType})`}
                    onClick={() => resetProgress(goal.id)}
                  />
                )}
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => {
                    setEditGoal(goal);
                    setGoalFormOpen(true);
                  }}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => deleteGoal(goal.id)}
                />
              </div>
            </div>

            {/* Goal Info */}
            <div className={styles.infoContainer}>
              <div className={`${styles.infoBadge} ${styles.targetBadge}`}>
                <FaBullseye />
                <span>
                  Target {goal.goalType === "sessions" ? "Sessions" : "Hours"}:{" "}
                  {goal.targetAmount}
                </span>
              </div>

              <div className={`${styles.infoBadge} ${styles.progressBadge}`}>
                <FaChartBar />
                Progress:{" "}
                {completionPercentage !== undefined
                  ? completionPercentage.toFixed(1)
                  : "N/A"}
                %
              </div>

              <div className={`${styles.infoBadge} ${styles.daysBadge}`}>
                <FaRegClock />
                Days Remaining:{" "}
                {daysRemaining !== undefined ? daysRemaining : "N/A"} days
              </div>
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setLogProgressGoal(goal)}
              >
                Log Progress
              </button>

              <button
                className={styles.primaryBtn}
                onClick={() => setModalGoal(goal)}
              >
                Show Progress
              </button>
            </div>
          </div>
        );
      })}
    </div>
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

      {/*Modal for Logging Progress*/}
      {logProgressGoal && (
        <div className={styles.modalBackdrop} onClick={() => setLogProgressGoal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <GoalProgress goal={logProgressGoal} updateGoal={updateGoals} hideForm={() => setLogProgressGoal(null)} onlyLogForm={true}/>
          </div>
        </div>
      )}

      {/* Modal for showing progress graph & history */}
      {modalGoal && (
        <div className={styles.modalBackdrop} onClick={() => setModalGoal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <GoalProgress
            goal={modalGoal}
            updateGoal={updateGoals}
            hideForm={() => setModalGoal(null)}
            onlyLogForm={false}
            />
            
          </div>
        </div>
      )}

      <div className={styles.guideBar}>
      <p> Use the Navbar to:</p>
        <ul>
        <li>Add a new goal with the <strong>“Create Goal”</strong> button</li>
    <li>Switch between <strong>all goals</strong> and <strong>recurring goals</strong></li>
    <li>Track your goals on the main dashboard</li>
        </ul>
      </div>

      <p>Get Started by creating a new goal or check your GoalProgress on existing ones!</p>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable/>
    </div>
  );
}

export default Dashboard