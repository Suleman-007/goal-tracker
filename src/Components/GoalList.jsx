import React, { useEffect, useState } from "react";
import GoalProgress from "./GoalProgress";

function GoalList({ goals, deleteGoal, startEditing, selectGoal, selectedGoal, updateGoal }) {
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [filter, setFilter] = useState("all"); // 🔹 Step 1: Add filtering state

  useEffect(() => {
    if (!goals || goals.length === 0) return;
    const savedGoalId = localStorage.getItem("expandedGoal");
    if (savedGoalId) {
      const parsedGoalId = JSON.parse(savedGoalId);
      const isGoalStillValid = goals.some((goal, index) => (goal.id || index) === parsedGoalId);
      if (isGoalStillValid) {
        setExpandedGoal(parsedGoalId);
      } else {
        localStorage.removeItem("expandedGoal"); // Remove invalid ID
      }
    }
  }, [goals]);

  const toggleExpand = (goal) => {
    const goalId = goal.id;
    setExpandedGoal((prev) => {
      const newExpanded = prev === goalId ? null : goalId;
      if (newExpanded !== null) {
        localStorage.setItem("expandedGoal", JSON.stringify(newExpanded));
      } else {
        localStorage.removeItem("expandedGoal");
      }
      return newExpanded;
    });

    if (expandedGoal !== goalId) {
      selectGoal(goal);
    }
  };

  const logProgress = (goal) => {
    console.log(`Logging progress for goal: ${goal.title}`);
  };

  // 🔹 Step 3: Apply filtering logic
  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true; // Show all goals
    if (filter === "completed") return goal.progressPercentage === 100; // Fully completed
    if (filter === "in-progress") return goal.progressPercentage > 0 && goal.progressPercentage < 100; // Started but not finished
    if (filter === "upcoming") return goal.progressPercentage === 0; // Not started yet
    return true;
  });

  return (
    <div>
      {/* 🔹 Step 2: Filter Dropdown */}
      <div>
        <label htmlFor="goalFilter">Filter Goals:</label>
        <select id="goalFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Goals</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <h2>Your Goals</h2>
      {filteredGoals.length === 0 ? (
        <p>No Goals found!</p>
      ) : (
        filteredGoals.map((goal, index) => {
          if (!goal) {
            console.log(`Goal at index ${index} is undefined`);
            return null;
          }
          console.log("Rendering goal:", goal);

          const goalId = goal.id || index;

          return (
            <div key={goalId} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <h3>{goal.title}</h3>
              <p>Type: {goal.goalType === "sessions" ? "Sessions" : "Hours"}</p>
              <p>Target: {goal.targetAmount} {goal.goalType}</p>
              <p>Progress: {goal.progressPercentage}%</p>
              <p>Days Left: {goal.daysRemaining}</p>
              <p>Start Date: {goal.startDate}</p>
              <p>End Date: {goal.endDate}</p>

              <button onClick={(e) => { e.stopPropagation(); logProgress(goal); }}> Log Progress</button>
              <button onClick={(e) => { e.stopPropagation(); toggleExpand(goal); }}>
                {expandedGoal === goalId ? "Collapse" : "Expand"}
              </button>

              <button onClick={(e) => { e.stopPropagation(); deleteGoal(index); }}>Delete</button>
              <button onClick={(e) => { e.stopPropagation(); startEditing(index); }}>Edit</button>

              {/* Show GoalProgress inline when expanded */}
              {expandedGoal === goalId && selectedGoal?.id === goalId && (<GoalProgress goal={selectedGoal} updateGoal={updateGoal} />)}
            </div>
          );
        })
      )}
    </div>
  );
}

export default GoalList;
