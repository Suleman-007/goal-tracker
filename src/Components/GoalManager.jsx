import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import GoalProgress from './GoalProgress';

function GoalManager(props) {
  console.log("props in goal manager", props)
  const {goals, setGoals, updateGoal} = props
  const [editingIndex, setEditingIndex] = useState(null);
  const [editGoal, setEditGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null); // track selected goal for progress logging



  const updateGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };

  const deleteGoal = (indexToRemove) => {
    const updatedGoals = goals.filter((_, index) => index !== indexToRemove);
    updateGoals(updatedGoals);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditGoal(goals[index]);
    setShowForm(true);
  };

  const handleSelectedGoal = (goal) => {
    setSelectedGoal(goal);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setEditGoal(null);
  };

  return (
    <div>
      <h2>Manage your Goals</h2>
      <button onClick={() => setShowForm(true)}>Create Goal</button>

      {showForm && (<GoalForm setGoals={setGoals} closeForm={closeForm} editGoal={editGoal} editIndex={editingIndex} />)}

      <GoalList goals={goals} deleteGoal={deleteGoal} startEditing={startEditing} selectGoal={handleSelectedGoal} selectedGoal={selectedGoal} />
    
      {(selectedGoal && updateGoal) ? (
         <GoalProgress goal={selectedGoal} updateGoal={updateGoal}/>
       ) : (
        <p>Select a goal to track progress</p>
      ) }
    
    </div>
  );
}

export default GoalManager;
