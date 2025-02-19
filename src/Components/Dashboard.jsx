import React, { useEffect, useState } from 'react'
import styles from '../CSSModules/Dashboard.module.css'
import { GoGoal } from "react-icons/go";
import GoalProgress from './GoalProgress';

function Dashboard({goals, updateGoal}) {
  // state to track which goal's progress form is open
  const [progressFormOpen, setProgressFormOpen] = useState(null);
  const [expandedGoal, setExpanededGoal] = useState(null);

  // state to hadle showing more goals
  const [showAllGoals, setShowGoals] = useState(false);

  // store completion percentage and days remaining for each goal
  const [goalProgressData, setGoalProgressData] = useState({});

  // limit number of goals displayed initially
  const displayedGoals = showAllGoals ? goals : goals.slice(0, 4);

  const calculateDaysRemaining = (goal) => {
    if(!goal.endDate) return'N/A';

    const end = new Date(goal.endDate);
    let lastProgressDate = null;
    
    console.log(`Goal: ${goal.title}, End Date:`, end);

    if(goal.progressLogs && goal.progressLogs.length > 0) {
      console.log(`Raw progress logs for ${goal.title}:`, goal.progressLogs);
      const validLogs = goal.progressLogs.filter(log => log.date && !isNaN(new Date(log.date).getTime()));
      console.log(`validlog are`, validLogs);
      if(validLogs.length > 0){
       validLogs.sort(
         (a, b) => new Date(b.date) - new Date(a.date));
         console.log(`sorted logs for ${goal.title}`, validLogs.map(log => log.date));
          const latestLog = validLogs[0];
          console.log(`latest log for ${goal.title}:`, latestLog);
         lastProgressDate = new Date(validLogs[0].date);
         console.log(`Goal: ${goal.title}, Last Progress Date after assignment in if statement`, lastProgressDate);

    }
  }

  console.log(`Goal: ${goal.title}, Last Progress Date outside if statement`, lastProgressDate);


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
  const handleProgressData = (goalId, completionPercentage, updatedGoal) => {
    setGoalProgressData((prevData) => ({
      ...prevData,
     [goalId]: completionPercentage,
    }));
  };


  return (
    <div className={styles.dashContainer}>
      <h1>Time-Based Goal Tracker <GoGoal /></h1>
      <p>Welcome to your Goal Tracker!</p>

    {/*Display Goals*/}
    <p>You have <strong>{goals.length}</strong> goals.</p>

    <div>
    <h2>Your Goals</h2>
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
          <p>Target Sessions: {goal.targetAmount}</p>
          <p>Progress: {completionPercentage !== undefined ? completionPercentage.toFixed(1) : 'N/A'}%</p>
          <p>Days Remaining: {daysRemaining !== undefined ? daysRemaining : 'N/A'} days</p>
          
          {/*Log Progress Button*/}
          <button onClick={() => setProgressFormOpen(progressFormOpen === goal.id ? null : goal.id)}>
            {progressFormOpen === goal.id ? "Cancel" : "Log Progress"}
          </button>

          {/* Show Log Progress Form if button is clicked */}
          {progressFormOpen === goal.id && (
           <GoalProgress goal={goal}
            updateGoal={(updatedGoal) => {
              updateGoal(updatedGoal);
              setProgressFormOpen(null);
            }} 
            hideForm={() => setProgressFormOpen(null)}
            onlyLogForm={true} // New prop to show only the log form
            />
          )}

          <button onClick={() => setExpanededGoal(expandedGoal === goal.id ? null : goal.id)}>
            {expandedGoal === goal.id ? "Hide Progress" : "Show Progress"}
          </button>

          {/*Show Progress Graph and History separately*/}
          {expandedGoal === goal.id && (
            <GoalProgress
             goal={goal} 
             updateGoal={updateGoal} 
             onlyLogForm={false}
             passProgressData ={handleProgressData}
             />
            )}
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

      <div className={styles.guideBar}>
      <p> Use this sidebar to:</p>
        <ul>
          <li>Create new goals</li>
          <li>View and track your existing goals</li>
        </ul>
      </div>

      <p>Get Started by creating a new goal or check your GoalProgress on existing ones!</p>
    </div>
  )
}

export default Dashboard