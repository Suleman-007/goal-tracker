import React, {useState} from 'react'
import GoalForm from './GoalForm';

function GoalManager({goals, setGoals}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editGoal, setEditGoal] = useState({
        title: '',
        targetSession: '',
        startDate: '',
        endDate: ''
    });

    const [showForm, setShowForm] = useState(false);

    // Function to delete goal
    const deleteGoal = (indexToRemove) => {
        setGoals(goals.filter((_, index) => index !== indexToRemove));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditGoal(goals[index]);
    };

    const updateGoal = () =>{
        const updateGoals = goals.map((goal, index) =>
        index === editingIndex ? editGoal : goal
        );
        setGoals(updateGoals);
        setEditingIndex(null);
    };
    const handleGoalFormSubmit = () =>{
        setShowForm(false);
    }

  return (
    <div>
        <h2>Manage your Goals</h2>
        <button onClick={() => setShowForm(true)}>Create Goal</button>

        {showForm && <GoalForm setGoals={setGoals} handleGoalFormSubmit={handleGoalFormSubmit}/>}
     <h2>Your Goals</h2>
    {goals.length === 0 ? (
      <p>No Goals yet!</p>
    ) : (
      goals.map((goal, index) => (
        <div key={index}>
            {editingIndex === index ? (
                <div>
                  <input
                  type="text"
                    value={editGoal.title}
                    onChange={(e) => setEditGoal({ ...editGoal, title: e.target.value})}
                    />
                      <input
                  type="number"
                  value={editGoal.targetSession}
                  onChange={(e) => setEditGoal({ ...editGoal, targetSession: e.target.value })}
                />
                  <input
                  type="date"
                  value={editGoal.startDate}
                  onChange={(e) => setEditGoal({ ...editGoal, startDate: e.target.value })}
                />
                 <input
                  type="date"
                  value={editGoal.endDate}
                  onChange={(e) => setEditGoal({ ...editGoal, endDate: e.target.value })}
                />
                <button onClick={updateGoal}>Save</button>
                </div>
            ):(
            <div>
          <h3>{goal.title}</h3>
          <p>Target Sessions: {goal.targetSession}</p>
          <p>Start Date: {goal.startDate}</p>
          <p>End Date: {goal.endDate}</p>
          <button onClick={() => deleteGoal(index)}>Delete</button>
          <button onClick={() => startEditing(index)}>Edit</button>
            </div>
            )}
        </div>
      ))
    )}

    </div>
  )
}

export default GoalManager