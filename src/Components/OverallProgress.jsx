import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "../CSSModules/OverallProgress.module.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OverallProgress = ({ goals }) => {
  // Categorizing Goals
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.progressLogs?.reduce((acc, log) => acc + parseInt(log.amount || 0, 10), 0) >= goal.targetAmount).length;
  const inProgressGoals = goals.filter((goal) => goal.progressLogs?.length > 0 && goal.progressLogs?.reduce((acc, log) => acc + parseInt(log.amount || 0, 10), 0) < goal.targetAmount).length;
  const pendingGoals = totalGoals - (completedGoals + inProgressGoals);

  // Chart Data
  const data = {
    labels: ["In Progress", "Completed", "Pending", "Total Goals"],
    datasets: [
      {
        data: [inProgressGoals, completedGoals, pendingGoals, totalGoals],
        backgroundColor: ["#36A2EB", "#4CAF50", "#FFC107", "#9E9E9E"],
        hoverBackgroundColor: ["#2196F3", "#388E3C", "#FFA000", "#616161"],
      },
    ],
  };

  return (
    <div className={styles.overallProgressContainer}>
      <h2>Overall Goal Progress</h2>
      <div className={styles.chartContainer}>
        <Doughnut data={data} />
      </div>
      <div className={styles.legend}>
        <p><span className={styles.blue}></span> In Progress: {inProgressGoals}</p>
        <p><span className={styles.green}></span> Completed: {completedGoals}</p>
        <p><span className={styles.yellow}></span> Pending: {pendingGoals}</p>
        <p><span className={styles.gray}></span> Total Goals: {totalGoals}</p>
      </div>
    </div>
  );
};

export default OverallProgress;
