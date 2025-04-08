import React from "react";
import styles from "../CSSModules/LandingState.module.css";
import { FaChartBar, FaBullseye, FaRedo, FaEdit, FaTrash } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";

const ExampleGoalCard = ({ title, goalType, target, recurringType, progress }) => {
  return (
    <div className={styles.goalCard}>
      {/* Header Row: Recurring + Actions */}
      <div className={styles.headerRow}>
        {recurringType ? (
          <div className={styles.recurringGroup}>
            <FaRedo />
            {recurringType.charAt(0).toUpperCase() + recurringType.slice(1)}
          </div>
        ) : <div></div>}

        <div className={styles.iconGroup}>
          <FaEdit title="Edit Goal" />
          <FaTrash title="Delete Goal" />
        </div>
      </div>

      {/* Title */}
      <h3 className={styles.goalTitle}>
        {title.length > 24 ? `${title.substring(0, 24)}...` : title}
      </h3>

      {/* Info */}
      <div className={styles.infoContainer}>
        <div className={styles.infoBadge}>
          <FaBullseye />
          <span>Target {goalType === "sessions" ? "Sessions" : "Hours"}: {target}</span>
        </div>

        <div className={styles.infoBadge}>
          <FaChartBar />
          <span>Progress: {progress}%</span>
        </div>

        <div className={styles.infoBadge}>
          <FaRegClock />
          <span>Days Remaining: 5</span>
        </div>
      </div>

      {/* Button Group */}
      <div className={styles.buttonGroup}>
        <button className={styles.secondaryBtn}>
          Log Progress
        </button>
        <button className={styles.primaryBtn}>
          Show Progress
        </button>
      </div>
    </div>
  );
};

const LandingState = () => {
  return (
    <div className={styles.container}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
        alt="Goal tracking"
        className={styles.image}
      />

      <h2 className={styles.heading}>No Goals Yet</h2>
      <p className={styles.subtext}>
        You haven’t added any goals yet. Set clear, measurable goals and start tracking your progress!
      </p>

      <div className={styles.examples}>
        <h4 className={styles.examplesHeading}>Examples to get you started:</h4>
        <div className={styles.cardGrid}>
          <ExampleGoalCard
            title="Read for 1 hour daily"
            goalType="hours"
            target={7}
            recurringType="daily"
            progress={0}
          />
          <ExampleGoalCard
            title="Complete 5 coding sessions"
            goalType="sessions"
            target={5}
            recurringType=""
            progress={20}
          />
          <ExampleGoalCard
            title="Workout 3 times weekly"
            goalType="sessions"
            target={3}
            recurringType="weekly"
            progress={33}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingState;
