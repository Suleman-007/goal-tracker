import React from 'react'
import styles from '../CSSModules/Dashboard.module.css'
import { GoGoal } from "react-icons/go";

function Dashboard({goals}) {
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
      goals.map((goal, index) => (
        <div key={index}>
          <h3>{goal.title}</h3>
          <p>Target Sessions: {goal.targetSession}</p>
          <p>Start Date: {goal.startDate}</p>
          <p>End Date: {goal.endDate}</p>
        </div>
      ))
    )}

    </div>

      <div className={styles.guideBar}>
      <p> Use this sidebar to:</p>
        <ul>
          <li>Create new goals</li>
          <li>View and track your existing goals</li>
        </ul>
      </div>

      <p>Get Started by creating a new goal or check your progress on existing ones!</p>
    </div>
  )
}

export default Dashboard