# Dashboard Project

## Project Overview

This project is a dynamic dashboard built using Next.js for the frontend and Node.js (Express) for the backend. It includes Google Sheets integration, dynamic table creation, and real-time updates using Google Apps Script and Socket.IO.

---

## Features & Functionality

### 1. Authentication (Login & Signup)

- Implemented JWT-based authentication using `jsonwebtoken` and `bcryptjs`.
- Users are automatically logged out when the token expires.
- Protected routes ensure users can only access the dashboard after logging in.

### 2. Dashboard with Table (Google Sheets Integration)

- Users can create tables with custom column headers and data types (Text/Date).
- Integrated Google Sheets API to fetch data directly from a sheet and display it dynamically in a table.
- Real-time updates are achieved by adding a script in Google Apps Script with an **edit trigger** that sends a request to the backend upon any sheet edits. The backend then uses **Socket.IO** to broadcast updates to all connected clients.

### 3. Dynamic Column Addition

- Users can dynamically add new columns directly on the dashboard without modifying the Google Sheet.
- New columns are appended at the end of the existing columns.
- Supported column types:
  - **Text** (default input)
  - **Date** (date picker input)
- Newly added columns are permanently saved for future sessions.

---

## Tech Stack

**Frontend:** Next.js, Tailwind CSS, ShadcnUI  
**Backend:** Node.js (Express), MongoDB, Socket.IO  
**Google Services:** Google Sheets API, Google Apps Script

---

## Installation Instructions

### Step 1: Clone the Repository

```bash
git clone <repo_link>
cd project-folder
```

### Step 2: Install Dependencies

For Server:

```bash
cd server
npm install
```

For Client:

```bash
cd client
npm install
```

### Step 3: Environment Variables

#### Server `.env` Sample

```
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id",...}
TOKEN_SECRET_KEY=<your_jwt_secret>
```

#### Client `.env.local` Sample

```
NEXT_PUBLIC_API_URL=<your_backend_url>
```

### Step 4: Run Locally

For the client:

```bash
cd client
npm run dev
```

For the server:

```bash
cd server
node index.js
```

---

## Project Screenshots

### Auth Page

![Signup](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495327/desktok_signup_lqrww2.png)

![login](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495327/mobile_login_vbuv21.png)

### Dashboard

![Dashboard](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495326/dashboard_mg2ldq.png)

![Dashboard](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495327/mobile_dashboard_f1dnbh.png)

### Loading Screen

![Loading](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495327/loader_nslybp.png)

### Popup Screen

![Popup](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495326/configure_column_popup_h3rxpl.png)

![Popup](https://res.cloudinary.com/dv4re7bf8/image/upload/v1741495325/adding_dynamic_column_z3hn8j.png)

---

## Live Links

- **Live Application:** [Your Live Link Here](https://dashboard-assignment-xlpo.vercel.app/dashboard)
- **Google Sheet for Testing:** [Sample Sheet Link](https://docs.google.com/spreadsheets/d/12uHTRAHg4b8MhRP4dgtHlEP9C4mvlMG5CQP4WgqaID8/edit?gid=0#gid=0)
