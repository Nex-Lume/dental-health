# Dental Health Web Application

A premium, modern web application for a dental clinic, designed with a focus on high-quality aesthetics, smooth animations, and a seamless user experience. 

This project features a React frontend with fluid scrolling and interactive animations, paired with an Express and SQLite backend for handling appointments and contact inquiries.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19, TypeScript, Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **Animations:** GSAP (GreenSock Animation Platform) + ScrollTrigger
- **Scrolling:** Lenis (for buttery-smooth momentum scrolling)

### Backend
- **Server:** Node.js, Express
- **Database:** SQLite (via `sql.js`)

## ✨ Key Features

- **Modern UI/UX:** Premium aesthetic with staggered reveals, masked cards, and fluid cursor simulations.
- **Smooth Scrolling:** Integrated Lenis scrolling for an Awwwards-style floaty feel.
- **Interactive Animations:** Advanced entrance and scroll-linked animations powered by GSAP.
- **Appointment Booking:** Users can seamlessly book appointments, saving data directly into the SQLite database.
- **Contact Form:** Integrated messaging system to handle user inquiries.
- **Responsive Design:** Fully responsive layout with custom mobile navigation.

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended)

### 1. Install Dependencies
Run the following command in the root directory to install all required packages:
```bash
npm install
```

### 2. Running the Application (Development Flow)

**Option A: Start Both Frontend and Backend (Recommended)**
You can start both the Vite development server and the Node.js backend simultaneously using:
```bash
npm run dev:all
```
*Note: This command is optimized for Windows (`start /B node server/index.js && vite`).*

**Option B: Start Separately**
If you prefer to run them in separate terminal windows:
- **Start Backend API (Port 3001):**
  ```bash
  npm run server
  ```
- **Start Frontend App (Port 5173):**
  ```bash
  npm run dev
  ```

### 3. Build for Production
To create a production-ready build of the frontend:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## 📡 API Endpoints

The backend server runs on `http://localhost:3001` and provides the following RESTful endpoints:

- **`GET /api/services`** - Retrieve a list of all available dental services.
- **`POST /api/appointments`** - Book a new appointment.
- **`GET /api/appointments`** - Retrieve all booked appointments.
- **`GET /api/appointments/:id`** - Retrieve a specific appointment by ID.
- **`POST /api/contacts`** - Submit a contact/inquiry message.

## 📂 Project Structure
- `/src`: Contains all frontend React code (Components, Pages, Hooks, Utilities).
- `/server`: Contains the Express server (`index.js`), database configuration (`db.js`), and the SQLite database file (`dental.db`).
- `/public`: Static assets.
