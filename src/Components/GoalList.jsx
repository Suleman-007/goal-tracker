import React, { useEffect, useState } from 'react';
import GoalProgress from './GoalProgress';

function GoalList({ goals, deleteGoal, startEditing, selectGoal, selectedGoal,updateGoal}) {
 
    const [expandedGoal, setExpandedGoal] = useState(null);

    useEffect(() => {
      if(!goals || goals.length === 0) return;
      const savedGoalId = localStorage.getItem("expandedGoal");
      if(savedGoalId){
        const parsedGoalId = JSON.parse(savedGoalId);

        const isGoalStillValid = goals.some((goal, index) => (goal.id || index) === parsedGoalId);
        if(isGoalStillValid) {
          setExpandedGoal(parsedGoalId);
        } else {
          localStorage.removeItem("expandedGoal"); //remove invalid ID
        }
      }
    }, [goals]);

    const toggleExpand = (goal) => {
      const goalId = goal.id ;

      setExpandedGoal((prev) => {
        const newExpanded = prev === goalId ? null : goalId;
     
      if(newExpanded !== null){
  
      localStorage.setItem("expandedGoal", JSON.stringify(newExpanded));
      } else {
        localStorage.removeItem("expandedGoal");
      }
      return newExpanded;
    });

    if(expandedGoal !== goalId) {
      selectGoal(goal);
    }

    const logProgress = (goal) =>{
      console.log(`Logging progress for goal: ${goal.title}`);

    };

  };
  return (
    <div>
      <h2>Your Goals</h2>
      {goals.length === 0 ? (
        <p>No Goals yet!</p>
      ) : (
        goals.map((goal, index) => {
          if(!goal){
            console.log(`Goal at index ${index} is undefined`);
            return null;
          }
          console.log("Rendering goal:", goal);

          const goalId = goal.id || index;

          return(
          <div key={goalId} style={{border: '1px solid #ddd', padding:'10px', marginBottom:'10px', borderRadius:'5px'}} >
            
            <h3>{goal.title}</h3>
            <p>Type: {goal.goalType === "sessions" ? "Sessions" : "Hours"}</p>
            <p>Target: {goal.targetAmount} {goal.goalType}</p>
            <p>Progress: {goal.progressPercentage}%</p>
            <p>Days Left: {goal.daysRemaining}</p>
            <p>Start Date: {goal.startDate}</p>
            <p>End Date: {goal.endDate}</p>
            
            <button onClick={(e) => {e.stopPropagation(); logProgress(goal);}}> Log Progress</button>
            <button onClick={(e) => {e.stopPropagation(); toggleExpand(goal);}}>
              {expandedGoal === goalId ? "Collapse" : "Expand"}
            </button>

            <button onClick={(e) => {e.stopPropagation(); deleteGoal(index)}}>Delete</button>
            <button onClick={(e) =>{e.stopPropagation(); startEditing(index)}}>Edit</button>
          
          {/*show GoalProgress inline when expanded */}
          
           {expandedGoal === goalId && selectedGoal?.id === goalId && (<GoalProgress goal={selectedGoal} updateGoal={updateGoal}/>)}
          </div>
        );
      })
      )}
    </div>
  );
}

export default GoalList;
