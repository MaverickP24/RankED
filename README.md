# RankED -- Real-Time JEE Battle Platform

A competitive personal learning and testing platform where JEE aspirants battle each other in real-time. Students solve Physics, Chemistry, and Math questions with live rankings and adaptive scoring logic based on performance and difficulty.

---

## Project Overview

JEE preparation often lacks the intensity of real-time competition. **RankED** bridges this gap by providing:
- **Real-Time 1v1 & Group Battles**: High-pressure problem-solving environments.
- **Adaptive Scoring**: Marks awarded based on difficulty, time remaining, and accuracy.
- **Modern Architecture**: Built with clean OOP principles and proven Design Patterns.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Context API, Axios, CSS Modules |
| **Backend** | Node.js, Express.js |
| **Real-time** | Socket.IO (WebSockets) |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |

---

## Architecture & Design Patterns

RankED is built following **SOLID** principles and utilizes several key design patterns to ensure scalability and maintainability:

- **Factory Pattern** (`QuestionFactory.js`): Dynamically creates MCQ, Integer, and Multiple-Correct question types.
- **Strategy Pattern** (`ScoringStrategy.js`): Swappable scoring algorithms for different exam modes (JEE Main, Advanced, Speed Battle).
- **Observer Pattern** (`LeaderboardObserver.js`): Ensures real-time leaderboard and analytics updates whenever an answer is submitted.
- **Singleton Pattern**: Centralized database connection and configuration management.
- **Facade Pattern** (`GameEngine.js`): Provides a simplified interface to the complex battle room logic.

Detailed architectural documentation can be found in the **[Project_Report.md](Project_Report.md)** file.

---

## System Requirements & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or a cloud URI)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env        # Fill in MONGO_URI, JWT_SECRET, and FRONTEND_URL
node utils/seedQuestions.js # Seeds the question bank
npm run dev                 # Starts on port 5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start                   # Starts on port 3000
```
*Note: The project is pre-configured to communicate via port 5001 to avoid common system conflicts.*

---

## Meet the Team

| Name | Role | Primary Contributions |
|---|---|---|
| **Pratyush Parida** | Project Lead | System Architecture, GameEngine, Sequence Diagrams |
| **Palak Gupta** | Database Architect | Mongoose Models, Authentication, ER Diagram |
| **Pratyush Chouksey** | Patterns Developer | Design Patterns (Factory/Strategy), Class Diagrams |
| **Joshit Dutta** | Integration Lead | Socket implementation, Auth Context, Use Cases |
| **Ananya Narang** | UI/UX Developer | Frontend Pages, Styling, Component Architecture |

---
