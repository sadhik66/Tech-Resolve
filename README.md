# Tech Resolve — Complete Networking & IT Learning Platform

A full-stack study website with a React interface and a Node.js/Express API. It includes networking lessons, a network lab, a command-line learning simulator, troubleshooting practice, quizzes, account registration/login, and saved learning progress.
## Project Preview

![Tech Resolve Homepage](frontend/tech-resolve-home.png)
## Requirements
- Windows 10/11
- Node.js LTS (includes npm)
- A MongoDB database (MongoDB Atlas free tier is suitable)
- Internet connection for the first dependency installation

## Quick start (Windows)

### 1. Configure MongoDB and the backend
1. Create a free MongoDB Atlas cluster and a database user.
2. In `backend`, copy `.env.example` and name the copy `.env`.
3. Open `backend/.env` and set your own values:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/tech_resolve?retryWrites=true&w=majority
JWT_SECRET=put_a_long_random_secret_here
CLIENT_URL=http://localhost:5173
```

Replace the example connection string with the one from your MongoDB Atlas account. Add your current IP address to Atlas Network Access. Do not share or upload your `.env` file.

### 2. Install dependencies
Double-click `setup.bat`, or run these commands from the project folder:

```bat
cd backend
npm install
cd ..\frontend
npm install
```

### 3. Start the website
Open two Command Prompt windows.

**Window 1 — backend:** double-click `start-backend.bat` or run:
```bat
cd backend
npm run dev
```

**Window 2 — frontend:** double-click `start-frontend.bat` or run:
```bat
cd frontend
npm run dev
```

Open http://localhost:5173 in Chrome or another browser. Keep both terminal windows open while using the website.

## Check the backend
Open http://localhost:5000/api/health. A successful response looks like:

```json
{"success":true,"message":"Tech Resolve API is running"}
```

## Main features
- Responsive learning dashboard
- Networking lessons and topic explanations
- Network lab and safe command simulator (educational simulation only)
- Troubleshooting scenarios
- Quizzes and progress tracking
- User registration and login
- MongoDB-backed account and progress storage

## API routes
- `GET /api/health` — API status
- `POST /api/auth/register` — register
- `POST /api/auth/login` — sign in
- `GET /api/auth/me` — current user (JWT required)
- `GET /api/lessons` — lesson catalogue
- `GET /api/progress` — load signed-in user's progress
- `PUT /api/progress` — save signed-in user's progress

## Common problems
- **`MONGO_URI` missing:** make sure `backend/.env` exists and contains `MONGO_URI` and `JWT_SECRET`.
- **MongoDB connection error:** check the Atlas username/password, URL-encode special characters in the password, and allow your IP in Atlas Network Access.
- **Port already in use:** close the other process using port 5000 or 5173, or change the port and matching frontend configuration.
- **`vite` not found:** run `npm install` inside `frontend`.
- **Login/progress fails:** make sure MongoDB is connected and the backend terminal is running.

## Before publishing online
This project is configured for local development. A public production deployment still needs HTTPS, production environment variables, rate limiting, secure hosting, database backups, and a production frontend/API URL configuration. The command simulator is educational and does not run commands on or change the visitor's computer.

---

## Live Project

- **Frontend:** https://tech-resolve-frontend.onrender.com/
- **Backend API:** https://tech-resolve.onrender.com/api/lessons
- **GitHub Repository:** https://github.com/sadhik66/Tech-Resolve

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Render |
| Version Control | Git, GitHub |

## Project Goals

1. Help beginners understand networking fundamentals.
2. Provide interactive networking learning experiences.
3. Teach troubleshooting through practical scenarios.
4. Track learning progress.
5. Build technical knowledge through structured lessons and quizzes.

## Developer

Developed by **Sadhik Shaik**.

A full-stack Information Technology learning project.
