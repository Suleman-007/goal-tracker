import React, {useEffect, useState} from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables); 
import 'chartjs-adapter-date-fns';  


function GoalProgress({ ...props}) {
  console.log("Received props in GoalProgress:", props);
  const {goal, updateGoal, hideForm, onlyLogForm, passProgressData} = props;
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

 const [progressLogs, setProgressLogs] = useState(goal.progressLogs || []);
 
 useEffect(() => {
  setProgressLogs(goal.progressLogs || []);
 }, [goal.progressLogs]);

 const completionPercentage = ((progressLogs.reduce((acc, log) => acc + parseInt(log.amount), 0) || 0) / goal.targetAmount)*100;

 const today = new Date();
 const endDate = new Date(goal.endDate);
 const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000*60*60*24)));

// pass data to Dashboard whenever these values change
useEffect(() =>{
  if(passProgressData){
    passProgressData(goal.id, completionPercentage, daysRemaining);
  }
}, [completionPercentage, daysRemaining, goal.id, passProgressData]);


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
    // Calculate new completion percentage
    const totalProgress = updatedGoal.progressLogs.reduce((acc, log) => acc + parseInt(log.amount, 10), 0);
    const completionPercentage = (totalProgress / updatedGoal.targetAmount) * 100;

    // Calculate new days remaining
  const today = new Date();
  const endDate = goal.endDate ? new Date(goal.endDate) : null;

  let daysRemaining = "N/A";
  if(endDate instanceof Date && !isNaN(endDate)){
   daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  }

  updateGoal(updatedGoal);
  if(passProgressData){
    passProgressData(goal.id, completionPercentage, daysRemaining);
  }
  setLogEntry({
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
  if (hideForm){
    hideForm();
  }
};

 //prepare data for the chart
 let loggedAmount = 0;
 const chartData = {
  labels: progressLogs.map((log) => log.date),
  datasets: [
    {
      label: `${goal.title} Progress`,
      data: progressLogs.map((log) => {
        loggedAmount += parseInt(log.amount, 10);
        return loggedAmount;
      }),
      borderColor: "blue",
      backgroundColor: "lightblue",
      fill: true,
    },
  ],
 };

 const chartOptions = {
  scales: {
    x:{
      type: 'time',
      time: {
        unit: 'day',
      },
      ticks: {
        max: new Date(goal.endDate),
        min: progressLogs.length > 0 ? new Date(progressLogs[0].date) : new Date(goal.startDate),
      },
    },
    y:{
      min: 0,
      max: Math.ceil(goal.targetAmount),
    },
  },
 };

  return (
    <div>
      {/* Log Progress Form (Only when onlyLogForm is true) */}
    {onlyLogForm ? (
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
        <button type="button" onClick={hideForm}>Close</button>

      </form>
      </div>
    ) : (
      <div>
        {/* Progress Graph & History (shown when onlyLogForm is false) */}
      <h4>Progress Graph</h4>
      {progressLogs.length > 0 ? (
         <Line data={chartData} options={chartOptions}/> 
    ) : (
       <p>No progress recorded yet.</p>
       )}

      <h4>Progress History</h4>
      <ul>
        {progressLogs.map((log, index) => (
          <li key={index}>
            {log.date}: {log.amount} {goal.goalType} - {log.note}
          </li>
        ))}
      </ul>
     </div>
    )}   
    </div>
  );
}

export default GoalProgress