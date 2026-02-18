# Cognitive DSA — AI-Powered Viva System

An AI tutor that evaluates student DSA code submissions and asks Socratic diagnostic questions using a RAG (Retrieve-Augment-Generate) pipeline.

---

## 📁 Project Structure

```
Bugging_Innovators/
│
├── 📦 frontend/                  ← React + Vite (UI)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── 🐍 backend/                   ← Python + FastAPI (AI Engine)
    ├── main.py                   ← FastAPI server (entry point)
    ├── viva_logic.py             ← RAG Loop (Retrieve → Augment → Generate)
    ├── database_manager.py       ← ChromaDB interface (Librarian)
    ├── judge_service.py          ← Judge0 code execution service
    ├── init_db.py                ← One-time DB initialization script
    ├── dsa_data.json             ← Knowledge base (DSA misconceptions)
    ├── requirements.txt          ← Python dependencies
    ├── .env                      ← API keys (never commit this!)
    ├── db/                       ← ChromaDB persistent vector store
    └── venv/                     ← Python virtual environment
```

---

## 🚀 Running the Project

### Backend (FastAPI)
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate       # Windows
source venv/bin/activate      # Mac/Linux

# Install dependencies (first time only)
pip install -r requirements.txt

# Initialize the vector database (first time only)
python init_db.py

# Start the server
uvicorn main:app --reload --port 8000
```
API available at: `http://localhost:8000`
Docs at: `http://localhost:8000/docs`

### Frontend (React)
```bash
# From the project root
npm install     # first time only
npm run dev
```
UI available at: `http://localhost:5173`

---

## 🧠 How the RAG Pipeline Works

1. **Student submits code** → `/submit` endpoint runs it via Judge0
2. **Code passes** → `/viva` endpoint triggers the RAG loop:
   - **Retrieve**: ChromaDB finds the most relevant misconception for the topic
   - **Augment**: Expert knowledge is injected into the Gemini prompt
   - **Generate**: Gemini asks a targeted Socratic question (not the answer!)

---

## 🔑 Environment Variables (backend/.env)

```
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
GEMINI_API_KEY=your_gemini_api_key
```
