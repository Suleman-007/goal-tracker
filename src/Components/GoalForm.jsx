import React, { useState } from 'react'
import styles from '../CSSModules/GoalForm.module.css';

function GoalForm({setGoals, handleGoalFormSubmit}) {

  const [goal, setGoal] = useState({
    title: "",
    targetSession: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals((prevGoals) => [...prevGoals, goal]);
    console.log("Goal Submitted", goal);
    setGoal({title: "", targetSession: "", startDate: "", endDate: ""});
    handleGoalFormSubmit();
  };

  return (
    <div className={styles.container}>
      <h1>Create New Goal</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
           type="text"
           value={goal.title}
           onChange={(e) => setGoal({...goal, title: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Target Sessions/Year</label>
          <input 
          type="number" 
          value={goal.targetSession}
          onChange={(e) => setGoal({...goal, targetSession: e.target.value})}
          min="1"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input 
          type="date"
          value={goal.startDate}
          onChange={(e) => setGoal({...goal, startDate: e.target.value})}
           />
        </div>
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input 
          type="date"
          value={goal.endDate}
          onChange={(e) => setGoal({...goal, endDate: e.target.value})}
           />
        </div>
        <button className={styles.button} type="submit">Create Goal</button>
      </form>

    </div>
  )
}

export default GoalForm