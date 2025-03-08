# RevoeAI Assignment - Dashboard with Google Sheets Integration

This project is a dynamic dashboard built using **Next.js**, **Node.js (Express)**, and **MongoDB**, with integrated **Google Sheets** updates via WebSockets and Google Apps Script.

## 🚀 Features

- **Google Sheets Integration**: Automatically updates data on the dashboard when changes are made in Google Sheets.
- **WebSocket Support**: Ensures real-time updates for a seamless user experience.
- **Google Apps Script Integration**: Automates the data synchronization process by pushing updates to the backend API.
- **JWT-Based Authentication**: Ensures secure data access.
- **Dynamic Table Features**: Provides flexibility for sorting, filtering, and displaying data.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Kabir400/dashboard-assignment.git
cd dashboard-assignment
```

### 2. Install Dependencies

```bash
1.cd server
2.npm install
3.cd client
4.npm install
```

### 3. Create a `.env` File 

- `Inside Server Folder`
  Add the following environment variables:

```
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id",...}
TOKEN_SECRET_KEY=<your_jwt_secret>
```

- `Inside Client Folder`
  Add the following environment variables:(.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ### 4. Setup Real-Time Google Sheets Integration
>
> To integrate real-time Google Sheets updates, you need to `deploy your application` 1st or you can use services like `ngrok`:
>
> 1. Open your Google Sheets document.
> 2. Click **Extensions → Apps Script**.
> 3. Paste the following code into the script editor:

```javascript
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;

  var data = sheet.getDataRange().getValues(); // Fetch entire sheet data

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ data: data }),
  };

  UrlFetchApp.fetch(
    "https://dashboard-assignment-dsy9.onrender.com/api/sheet-update",
    options
  );
}
```

4. Save and deploy the script as a **web app** with appropriate permissions.

### 5. Run the Project Locally

```bash
cd client | npm run dev & cd server | npm start
```

### 6. Deploy to Render

1. Push your code to GitHub.
2. On Render, create a **Web Service**.
3. Select your GitHub repository.
4. Add the `.env` variables in Render's **Environment Variables** section.
5. Deploy the project.

---

## 🧩 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, ShadcnUI
- **Backend:** Node.js (Express), MongoDB
- **Google Services:** Google Sheets API, Google Apps Script


