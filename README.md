** Time-Based Goal Tracking App
**
# Prerequisites

  Before setting up the project, make sure you have the following installed:

  • Node.js (Latest LTS) - https://nodejs.org/ (Includes npm)

  • Git - https://git-scm.com/ (For version control)

  • Code Editor (Recommended: VS Code) - https://code.visualstudio.com/

  # Setup Instructions

1. Clone the Repository
   
  Run the following command in your terminal:

  git clone https://github.com/Suleman-007/goal-tracker.git

  cd goal-tracking-app

3. Install Dependencies

  Run the following command to install project dependencies:

  npm install

3. Set Up Environment Variables

  1. Create a `.env` file in the root directory.
  
  2. Add the following line to the `.env` file:
  
  VITE_API_BASE_URL=https://your-backend-api.com
  
  3. Restart the development server after updating the `.env` file:
  
    npm run dev

4. Start the Development Server

  Run the following command:

  npm run dev

  The app will be available at `http://localhost:5173/` by default.

5. Build for Production

  To generate an optimized production build, run:

  npm run build

  This will create the production-ready files in the `dist/` directory.
