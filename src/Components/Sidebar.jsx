import React from 'react'
import { NavLink } from 'react-router-dom';
import styles from '../CSSModules/Sidebar.module.css'
import { FaTimes } from "react-icons/fa";
function Sidebar({isVisible, toggleSidebar}) {
  return (
    <div className={`${styles.sidebar} ${isVisible ? styles.visible : styles.hidden}`}
    >
    <nav className={styles.navContainer}>
        <NavLink to="/"
        className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink} ` : styles.navLink}
        >
        Dashboard
        </NavLink>
         
        <NavLink to="GoalManager"
        className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink} ` : styles.navLink}
        >
          GoalManager
        </NavLink>
        <NavLink to="/GoalProgress/${goalId}" 
        className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink} ` : styles.navLink}
        >
         GoalProgress</NavLink>
    </nav>

    
    <button className={styles.closeButton}
      onClick={toggleSidebar}
    >
      <FaTimes />
    </button>

    </div>
  )
}

export default Sidebar