import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {FaBars, FaTimes} from 'react-icons/fa';
import styles from '../CSSModules/Navbar.module.css';

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };
  
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };
    
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}> Goal Tracker </div>

            <button 
            className={styles.menuToggle} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes/> : <FaBars/>}  
            </button>

            <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.showMenu : ''}`}>
                <li>
                    <NavLink to="/" 
                    className={({ isActive }) => isActive ? styles.activeLink : ''}
                    onClick={closeMobileMenu}
                    >
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <button className={styles.createGoalBtn}> Create Goal </button>
                </li>
            </ul>

        </nav>
    
  );
}

export default Navbar;