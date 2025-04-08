import {useEffect, useState} from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables); 
import 'chartjs-adapter-date-fns';  
import styles from '../CSSModules/GoalProgress.module.css';
import { FaTimes } from 'react-icons/fa';

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
 const [showFullHistory, setShowFullHistory] = useState(false);

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

  const logDate = new Date(logEntry.date);
  const today = new Date();
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);

  // ✅ Prevent logging before the start date
  if (logDate < startDate) {
    alert("You cannot log progress before the start date.");
    return;
  }

  // ✅ Prevent logging after the end date
  if (logDate > endDate) {
    alert("You cannot log progress after the goal's end date.");
    return;
  }

  // ✅ Restrict logging to within 3 days of today
  const daysDifference = (today - logDate) / (1000 * 60 * 60 * 24);
  if (daysDifference > 3) {
    alert("You can only log progress within 3 days of today.");
    return;
  }

  // ✅ Prevent duplicate entries for the same date
  const isDuplicate = progressLogs.some(log => log.date === logEntry.date);
  if (isDuplicate) {
    alert("You have already logged progress for this date!");
    return; 
  }

  if (!logEntry.amount) {
    alert("Please enter a valid amount.");
    return;
  }

  if (typeof updateGoal !== "function") {
    console.error("updateGoal is not a function!", updateGoal);
    return;
  }

  const updatedGoal = { 
    ...goal, 
    progressLogs: [...(goal.progressLogs || []), logEntry], 
  };

  // ✅ Recalculate Completion Percentage
  const totalProgress = updatedGoal.progressLogs.reduce(
    (acc, log) => acc + parseInt(log.amount, 10), 
    0
  );
  const completionPercentage = (totalProgress / updatedGoal.targetAmount) * 100;

  // ✅ Recalculate Days Remaining
  let daysRemaining = "N/A";
  if (!isNaN(endDate)) {
    daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  }

  updateGoal(updatedGoal);
  
  if (passProgressData) {
    passProgressData(goal.id, completionPercentage, daysRemaining);
  }

  // ✅ Reset Form After Submission
  setLogEntry({
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  if (hideForm) {
    hideForm();
  }
};


  // Ensure logs are sorted by date
  const sortedLogs = [...progressLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
 //prepare data for the chart
 let loggedAmount = 0;
 const chartData = {
  labels: sortedLogs.map((log) => new Date(log.date)),
    datasets: [
    {
      label: `${goal.title} Progress`,
      data: sortedLogs.map((log) => {
        loggedAmount += parseInt(log.amount, 10);
        return loggedAmount;
      }),
      borderColor: "blue",
      backgroundColor: "rgba(173, 216, 230, 0.5)",
      fill: true,
      tension: 0.3,
    },
  ],
 };

 const chartOptions = {
  responsive: true,
    maintainAspectRatio: false,
  scales: {
    x:{
      type: 'time',
      time: {
        unit: 'day',
      },
      ticks: {
        min: sortedLogs.length > 0 ? new Date(sortedLogs[0].date) : new Date(goal.startDate),
        max: new Date(goal.endDate),
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
    <div className={styles.logProgressForm}>
      <div className={styles.logProgressHeader}> 
      <h3>Log Progress for {goal.title}</h3>
      <button className={styles.closeBtn} onClick={hideForm}>
        <FaTimes/>
      </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
        <label>Date:</label>
        <input type="date" name="date" value={logEntry.date} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
        <label>    {goal.goalType && goal.goalType.toLowerCase() === "hours" ? "Hours Logged:" : "Sessions Completed:"}
        </label>
        <input type="number" name="amount" value={logEntry.amount} onChange={handleChange} 
              placeholder={goal.goalType && goal.goalType.toLowerCase() === "hours" ? "Enter hours" : "Enter sessions"}
              required />
        </div>

        <div className={styles.formGroup}>
        <label>Note:</label>
        <textarea name="note" value={logEntry.note} onChange={handleChange} 
          rows="6" placeholder="Enter your notes here..."/>
        </div>
        <div className={styles.addLogBtnContainer}>
        <button className={styles.addLogBtn} type="Submit">Add Log</button>
        </div>
      </form>
      </div>
    ) : (
      <div>
        {/* Progress Graph */}
        <div className={styles.progressContainer}>
          <div className={styles.progressGraph}>
        <div className={styles.progressGraphHeader}>
      <h4>Progress Graph</h4>
      <button className={styles.closeBtn} onClick={hideForm}>
       <FaTimes />
     </button>
     </div>
     <div className={styles.chartContainer}>
            <Line data={chartData} options={chartOptions} />
      </div>
      </div>

      <div className={styles.progressHistory}>
       <h4>Progress History</h4>
       <ul>
         {progressLogs.length === 0 ? (
            <p>No progress recorded yet.</p>
          ) : (
           [...progressLogs] 
             .reverse() 
             .slice(0, showFullHistory ? progressLogs.length : 3) // Show only 3 initially
             .map((log, index) => (
               <li key={index}>
                 {log.date}: {log.amount} {goal.goalType} - {log.note}
                </li>
             ))
         )}
       </ul>
          </div>
{progressLogs.length > 3 && (
  <button
    className={styles.showMoreBtn}
    onClick={() => setShowFullHistory(!showFullHistory)}
  >
    {showFullHistory ? "Show Less" : "Show More"}
  </button>
)}
</div>
     </div>
    )}   
    </div>
  );
}

export default GoalProgress