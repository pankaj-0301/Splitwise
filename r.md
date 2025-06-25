# 💸 SplitWise Clone – Expense Sharing App

A full-stack SplitWise-style web app for managing group expenses. Built using **React** (frontend), **FastAPI** (backend), **Supabase PostgreSQL**, and **Gemini API** for intelligent chatbot support.

---

## 📁 Project Structure

```
splitwise-clone/
├── backend/              # FastAPI backend (Python)
│   ├── app/              # Application logic, routers, models
│   ├── Dockerfile        # Docker setup for backend
│   └── requirements.txt
├── frontend/             # React frontend
│   └── ...
├── docker-compose.yml    # Orchestrates frontend & backend
├── .env                  # Contains GEMINI_API_KEY & DB creds
└── README.md
```

---

## 🚀 Quick Start

### ✅ Requirements

* Docker + Docker Compose
* Node.js & npm (for local frontend dev)
* Python 3.11+ (for local backend dev)

---

### 🔧 Setup (Using Docker)

1. **Add your environment variables** in a `.env` file:

   ```
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_supabase_postgres_url
   ```

2. **Run the full stack**:

   ```bash
   docker-compose up --build
   ```

3. Visit:

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## 🌐 API Endpoints

### 👥 Users

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/users/`              | List all users              |
| POST   | `/users/`              | Create a new user           |
| GET    | `/users/{id}/balances` | Get personal group balances |

---

### 👪 Groups

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/groups`      | Create a group with users |
| GET    | `/groups`      | List all groups           |
| GET    | `/groups/{id}` | Group info                |

---

### 💰 Expenses

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/groups/{id}/expenses` | Add expense to a group |

---

### 📊 Balances

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/groups/{id}/balances` | View group user balances |

---

### 🤖 Chatbot (Gemini LLM)

| Method | Endpoint   | Description                        |
| ------ | ---------- | ---------------------------------- |
| POST   | `/chatbot` | Ask financial questions to chatbot |

Payload:

```json
{
  "message": "how much does John owe in GoaTrip?"
}
```

---

## 🧠 Gemini API Integration

This app uses Google Gemini 1.5 Flash model to provide intelligent financial answers based on actual group/user/expense data fetched from the Supabase DB.

---

## ⚙️ Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Deployment

The backend is already configured to run on **Render** using:

```js
const API_BASE = 'https://splitwise-onpc.onrender.com';
```

Frontend can be deployed on **Vercel**, **Netlify**, or Render as well.

---

## ✍️ Assumptions

* No login system (simplified for prototype).
* All group/user info is assumed to be public.
* All expense splits are either equal or percentage-based.
* Gemini chatbot answers only from database context; no external browsing.

---

## 📜 License

This project is licensed for educational use.

---

## 👨‍💻 Built By

**Pankaj Paliwal** – [LinkedIn](https://linkedin.com/in/pankajpaliwal2211)
IIIT Nagpur | Full Stack Developer
