import React, {useState} from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables); 

function GoalProgress({ ...props}) {
  console.log("Received props in GoalProgress:", props);
  const {goal, updateGoal} = props;
  if(!goal || !goal.id){
    // console.log("GoalProgress received a null or undefined goal.");
    return <p>No progress data available</p>;
  }
  // console.log("Rendering GoalProgress for:", goal.title);
  // console.log("Received updateGoal function:", updateGoal);

  // state to log new progress entries
  const [logEntry, setLogEntry] = useState({
    amount: "", 
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

const handleChange = (e) => {
  setLogEntry({ ...logEntry, [e.target.name]: e.target.value});
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!logEntry.amount){
    alert("Please enter a valid amount");
    return;
  }

  if(typeof updateGoal !== "function") {
    console.error("updateGoal is not a function!", updateGoal);
    return;
  }

  // new goal object with updated progress logs
  const updatedGoal = { ...goal, progressLogs: [ ...(goal.progressLogs || []), logEntry], };
  updateGoal(updatedGoal);
  setLogEntry({
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
};

  // Ensure progressLogs is an array
  const progressLogs = goal.progressLogs || [];

 //prepare data for the chart
 const chartData = {
  labels: progressLogs.map((log) => log.date),
  datasets: [
    {
      label: `${goal.title} Progress`,
      data: progressLogs.map((log) => parseInt(log.amount, 10)),
      borderColor: "blue",
      backgroundColor: "lightblue",
      fil: true,
    },
  ],
 };


  return (
    <div>
      <h3>Log Progress for {goal.title}</h3>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={logEntry.date} onChange={handleChange} />

        <label>Amount</label>
        <input type="number" name="amount" value={logEntry.amount} onChange={handleChange} required />

        <label>Note:</label>
        <input type="text" name="note" value={logEntry.note} onChange={handleChange} />

        <button type="Submit">Add Log</button>

      </form>

      <h4>Progress Graph</h4>
      {progressLogs.length > 0 ? <Line data={chartData}/> : <p>No progress recorded yet.</p>}

      <h4>Progress History</h4>
      <ul>
        {progressLogs.map((log, index) => (
          <li key={index}>
            {log.date}: {log.amount} {goal.goalType} - {log.note}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default GoalProgress