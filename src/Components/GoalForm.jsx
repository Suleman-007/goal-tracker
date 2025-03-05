import  { useState, useEffect } from "react";
import styles from "../CSSModules/GoalForm.module.css";
import {FaTimes} from "react-icons/fa";
import { toast } from "react-toastify"; 

function GoalForm({ setGoals, closeForm, editGoal, editIndex }) {
  const [goal, setGoal] = useState({
    id: null,
    title: "",
    goalType: "sessions",
    targetAmount: "",
    completedAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
    progressLogs: []
  });

  // Populate form if editing
  useEffect(() => {
    if (editGoal) {
      setGoal({ ...editGoal});
    }
  }, [editGoal]);

  const handleChange = (e) => {
    setGoal({ ...goal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.title || !goal.targetAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    setGoals((prevGoals) => {
      if (goal.id){
        // update existing goal based on its ID
        toast.success("Goal updated successfully!");
        return prevGoals.map((g) => (g.id === goal.id ? goal :g));
      } else {
        toast.success("New goal created");
        // Create a new goal and assign a unique ID
        return [...prevGoals, {...goal, id: Date.now()}];
      }
  });

    closeForm();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <h1>{editGoal ? "Edit Goal" : "Create New Goal"}</h1>
      <FaTimes className={styles.closeIcon} onClick={closeForm}/>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input type="text" name="title" value={goal.title} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Goal Type</label>
          <select name="goalType" value={goal.goalType} onChange={handleChange}>
            <option value="sessions">Sessions</option>
            <option value="hours">Hours</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Target {goal.goalType === "sessions" ? "Sessions" : "Hours"}</label>
          <input type="number" name="targetAmount" value={goal.targetAmount} onChange={handleChange} min="1" required />
        </div>

        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input type="date" name="startDate" value={goal.startDate} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>End Date</label>
          <input type="date" name="endDate" value={goal.endDate} onChange={handleChange} min={goal.startDate} />
        </div>
         <div className={styles.buttonGroup}>
        <button className={styles.saveButton} type="submit">{editGoal ? "Update Goal" : "Save Goal"}</button>
        <button className={styles.cancelButton} type="button" onClick={closeForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default GoalForm;
