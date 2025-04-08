import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../CSSModules/Navbar.module.css';

function Navbar({ onCreateGoal, recurringFilterOn, setRecurringFilterOn, filters = {}, updateFilter, clearFilters, searchQuery, setSearchQuery }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);
    const toggleFilterMenu = () => setFilterMenuOpen(prev => !prev);
    const handleCategoryToggle = (category) => {
        setExpandedCategory(prev => (prev === category ? null : category));
    };

    const renderFilterOptions = (category, options) => (
        <div className={styles.filterSubMenu}>
            {options.map(option => (
                <div
                    key={option.value}
                    className={`${styles.filterOption} ${filters[category] === option.value ? styles.active : ''}`}
                    onClick={() => updateFilter(category, option.value)}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Goal Tracker</div>
            <div className={styles.navRight}>
            <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.showMenu : ''}`}>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? styles.activeLink : '')}
                        onClick={closeMobileMenu}
                    >
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <button className={styles.createGoalBtn} onClick={onCreateGoal}>Create Goal</button>
                </li>

                <li>
                <button
  className={`${styles.filterToggleBtn} ${recurringFilterOn ? styles.activeFilter : ''}`}
  onClick={() => setRecurringFilterOn(prev => !prev)}
  title="Click to toggle filter for recurring goals"
>
  Recurring
</button>
                </li>
                {/* 🔽 Filter Dropdown Toggle */}
                {/* <li className={styles.filterWrapper}>
                    <button className={styles.filterToggle} onClick={toggleFilterMenu}>
                        Filter By ▾
                    </button>

                    {filterMenuOpen && (
                        <div className={styles.filterDropdown}>
                            <div className={styles.filterCategory} onClick={() => handleCategoryToggle('recurring')}>
                                Recurring ▸
                                {expandedCategory === 'recurring' &&
                                    renderFilterOptions('recurring', [
                                        { label: 'Recurring', value: 'recurring' },
                                        { label: 'Non-Recurring', value: 'non-recurring' }
                                    ])
                                }
                            </div>

                            <div className={styles.filterCategory} onClick={() => handleCategoryToggle('goalType')}>
                                Goal Type ▸
                                {expandedCategory === 'goalType' &&
                                    renderFilterOptions('goalType', [
                                        { label: 'Hours', value: 'hours' },
                                        { label: 'Sessions', value: 'sessions' }
                                    ])
                                }
                            </div>

                            <div className={styles.filterCategory} onClick={() => handleCategoryToggle('status')}>
                                Status ▸
                                {expandedCategory === 'status' &&
                                    renderFilterOptions('status', [
                                        { label: 'Completed', value: 'completed' },
                                        { label: 'In Progress', value: 'in-progress' },
                                        { label: 'Pending', value: 'pending' }
                                    ])
                                }
                            </div>

                            <button className={styles.clearBtn} onClick={clearFilters}>Clear Filters</button>
                        </div>
                    )}
                </li> */}
            </ul>

             {/* 🔍 Search Input */}
            <input
              type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            />
            </div>


            <button
                className={styles.menuToggle}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

        </nav>
    );
}

export default Navbar;
