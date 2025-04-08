import React from "react";
import styles from '../CSSModules/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} Goal Tracker App · Made with ❤️ for You
      </p>

      <p className={styles.subText}>
        Track your progress, every day. One step closer to your goals.
      </p>

      <div className={styles.footerLinks}>
        <a href="https://github.com/Suleman-007/goal-tracker" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="#Contact">Contact</a>
        <a href="#privacy">Privacy</a>
      </div>

      <a
        href="https://github.com/Suleman-007/goal-tracker"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubIconLink}
        aria-label="View source code on GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.githubIcon}
        >
          <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.289 3.438 9.773 8.205 11.387.6.111.82-.261.82-.579 0-.287-.011-1.244-.016-2.444-3.338.726-4.042-1.613-4.042-1.613-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.082-.729.082-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.997.108-.775.419-1.305.762-1.605-2.665-.304-5.467-1.332-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.048.137 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.872.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.37.823 1.102.823 2.222 0 1.605-.014 2.898-.014 3.293 0 .321.216.694.825.576C20.565 22.066 24 17.584 24 12.297 24 5.67 18.627 0.297 12 0.297z" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
