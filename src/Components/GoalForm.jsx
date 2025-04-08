import { useState, useEffect } from "react";
import styles from "../CSSModules/GoalForm.module.css";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function GoalForm({ setGoals, closeForm, editGoal, goals }) {
  const [goal, setGoal] = useState({
    id: null,
    title: "",
    targetAmount: 1,
    completedAmount: 0,
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
    progressLogs: [],
    recurringType: "", // ✅ Recurring goal type
  });

  useEffect(() => {
    if (editGoal) {
      setGoal({ ...editGoal });
    }
  }, [editGoal]);

  useEffect(() => {
    if (goal.recurringType === "daily") {
      setGoal((prev) => ({
        ...prev,
        startDate: new Date().toISOString().split("T")[0], // Always set to today
      }));
    }
  }, [goal.recurringType]);
  
  const handleRecurringChange = (e) => {
    const { value } = e.target;
    const newStartDate = new Date(goal.startDate);
    let newEndDate = new Date(newStartDate); // Copy start date
  
    if (value !== "") { // ✅ Only update end date if recurring type is selected
      switch (value) {
        case "daily":
          break; // No end date change needed for daily
        case "weekly":
          newEndDate.setDate(newStartDate.getDate() + 6);
          break;
        case "monthly":
          if (newStartDate.getDate() === 1) {
            newEndDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
          } else {
            newEndDate.setMonth(newStartDate.getMonth() + 1);
            newEndDate.setDate(newStartDate.getDate() - 1);
          }
          break;
        case "yearly":
          if (newStartDate.getMonth() === 0 && newStartDate.getDate() === 1) {
            newEndDate = new Date(newStartDate.getFullYear(), 11, 31);
          } else {
            newEndDate.setFullYear(newStartDate.getFullYear() + 1);
            newEndDate.setDate(newStartDate.getDate() - 1);
          }
          break;
        default:
          newEndDate = new Date(goal.endDate); // ✅ Keep the same end date for non-recurring goals
      }
    }
  
    setGoal((prev) => ({
      ...prev,
      recurringType: value,
      endDate: value
        ? newEndDate.toISOString().split("T")[0]
        : prev.endDate || new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0], // Set end of year only if empty
    }));    
  };
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let newStartDate = new Date(value);
    let newEndDate = new Date(newStartDate); // Used if recurring logic is needed
  
    if (name === "startDate" && goal.recurringType) {
      switch (goal.recurringType) {
        case "weekly":
          newEndDate.setDate(newStartDate.getDate() + 6);
          break;
        case "monthly":
          if (newStartDate.getDate() === 1) {
            newEndDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
          } else {
            newEndDate.setMonth(newStartDate.getMonth() + 1);
            newEndDate.setDate(newStartDate.getDate() - 1);
          }
          break;
        case "yearly":
          if (newStartDate.getMonth() === 0 && newStartDate.getDate() === 1) {
            newEndDate = new Date(newStartDate.getFullYear(), 11, 31);
          } else {
            newEndDate.setFullYear(newStartDate.getFullYear() + 1);
            newEndDate.setDate(newStartDate.getDate() - 1);
          }
          break;
        default:
          break;
      }
  
      // If startDate changed and goal is recurring, update both startDate and endDate
      setGoal((prevGoal) => ({
        ...prevGoal,
        startDate: value,
        endDate: newEndDate.toISOString().split("T")[0],
      }));
    } else if (name === "endDate") {
      // ✅ Allow manual update of endDate (non-recurring)
      setGoal((prevGoal) => ({
        ...prevGoal,
        endDate: value,
      }));
    } else {
      // Handle other fields normally
      setGoal((prevGoal) => ({
        ...prevGoal,
        [name]: type === "checkbox" ? (checked ? "high" : "medium") : value,
      }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.title || !goal.targetAmount) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const isDuplicateTitle = goals.some(
      (g) => g.title.toLowerCase() === goal.title.toLowerCase() && g.id !== goal.id
    );
    if (isDuplicateTitle) {
      toast.error("A goal with this title already exists.");
      return;
    }

    if (goal.targetAmount < 1) {
      toast.error("Target amount must be at least 1.");
      return;
    }

    if (new Date(goal.endDate) < new Date(goal.startDate)) {
      toast.error("End date cannot be before the start date.");
      return;
    }

    setGoals((prevGoals) => {
      if (goal.id) {
        toast.success("Goal updated successfully!");
        return prevGoals.map((g) => (g.id === goal.id ? goal : g));
      } else {
        toast.success("New goal created");
        return [...prevGoals, { ...goal, id: Date.now() }];
      }
    });

    closeForm();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{goal.id ? "Edit Goal" : "Create New Goal"}</h1>
        <FaTimes className={styles.closeIcon} onClick={closeForm} />
      </div>
      <form onSubmit={handleSubmit}>
        {/* Title & Priority Toggle in the Same Line */}
        <div className={styles.titleRow}>
          <label className={styles.titleLabel}>Title</label>
          <label className={styles.priorityLabel}>
            High Priority
            <input
              type="checkbox"
              checked={goal.priority === "high"}
              onChange={() =>
                setGoal((prevGoal) => ({
                  ...prevGoal,
                  priority: prevGoal.priority === "high" ? "medium" : "high",
                }))
              }
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="title"
            value={goal.title}
            onChange={handleChange}
            required
          />
        </div>

       {/* Recurring Goal Section */}
<div className={styles.goalOptionsRow}>

{/* Outer Div for Recurring Label, Tooltip, and Toggle Button */}
<div className={styles.recurringInlineGroup}>

  {/* Recurring Label & Tooltip (Inline) */}
  <div className={styles.recurringLabel}>
    <label>Recurring</label>
    <span className={styles.tooltip} title="Automatically repeats after completion (Daily, Weekly, etc.)"> ℹ️ </span>
  </div>

  {/* Goal Type Toggle Button */}
  <div className={styles.hoverWrapper}>
  <button
   type="button"
    className={styles.toggleButton}
    onClick={() =>
      setGoal((prev) => ({
        ...prev,
        goalType: prev.goalType === "hours" ? "sessions" : "hours",
      }))
    }
  >
    {goal.goalType === "hours" ? "Hours" : "Sessions"}
  </button>
  <span className={styles.hoverMessage}>
    Click to switch between Hours-based & Sessions-based goals
  </span>
</div>




</div>

{/* Recurring Dropdown (Below Inline Group) */}
<select
  name="recurringType"
  value={goal.recurringType || ""}
  onChange={handleRecurringChange} // Updated function
  className={styles.recurringDropdown}
>
  <option value="">No</option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
  <option value="yearly">Yearly</option>
</select>


</div>


{/* Target Amount (Dynamically Updates Label) */}
<div className={styles.formGroup}>
<label>Target {goal.goalType === "hours" ? "Hours" : "Sessions"}</label>
<input
  type="number"
  name="targetAmount"
  value={goal.targetAmount}
  onChange={handleChange}
  min="1"
  required
/>
</div>


        {/* Start Date */}
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={goal.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={goal.endDate}
            onChange={handleChange}
            min={goal.startDate}
          />
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} type="submit">
            {goal.id ? "Update Goal" : "Save Goal"}
          </button>
          <button className={styles.cancelButton} type="button" onClick={closeForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalForm;
