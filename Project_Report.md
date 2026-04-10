# RankED – System Design Project Report (Final Version)

## 🔹 Project Overview
**RankED** is a real-time competitive learning platform designed for JEE aspirants. It simulates high-pressure exam environments through 1v1 battles, adaptive scoring, and live leaderboards. This version represents the optimized, production-ready codebase with refined UI and core services.

---

## 🔹 System Design Optimization
- **WebSocket-Driven Real-time Communication**: Sub-millisecond updates for game state.
- **In-Memory Battle State**: Map-based match management.
- **Tiered ELO System**: Competitive matchmaking via `RatingService`.

---

## 🔹 OOP Concepts Applied
1. **Encapsulation**: State protection in `GameEngine`.
2. **Abstraction**: Abstract `ScoringStrategy` interfaces.
3. **Inheritance**: Specialized Question types.
4. **Polymorphism**: Swappable scoring algorithms.

---

## 🔹 Design Patterns
- **Factory Pattern**: `QuestionFactory.js`
- **Strategy Pattern**: `ScoringStrategy.js`
- **Observer Pattern**: `LeaderboardObserver.js`
- **Singleton Pattern**: `ConfigManager.js`, `db.js`
- **Facade Pattern**: `GameEngine.js`

---

## 🔹 SOLID Principles
- **S**: Single Responsibility (Rating, Sockets, Auth).
- **O**: Open/Closed (Scoring strategies).
- **L**: Liskov Substitution (Swappable strategies).
- **I**: Interface Segregation (Observer updates).
- **D**: Dependency Inversion (Socket context).

---

## 🔹 Team Members & Contributions
| Name | GitHub ID | Contribution |
|---|---|---|
| **MaverickP24** | [@MaverickP24](https://github.com/MaverickP24) | Project Lead, Backend Core, System Architecture, Sequence Diagram |
| **Palak Patel** | [@palak22291](https://github.com/palak22291) | Backend Models, Auth logic, ER Diagram |
| **Pratyush Chouksey** | [@Pratyush-Chouksey](https://github.com/Pratyush-Chouksey) | Design Pattern implementations, SOLID alignment, Class Diagram |
| **Joshit Dutta** | [@joshitdutta000](https://github.com/joshitdutta000) | Frontend Core, Socket hooks, Use Case Diagram |
| **Ananya Gupta** | [@HeheAnanya](https://github.com/HeheAnanya) | UI Components, Dashboard & Arena pages, UX Design |
