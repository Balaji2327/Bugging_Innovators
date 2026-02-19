# Free Hosting Plan for CognitiveDSA

This guide describes how to host the CognitiveDSA platform for free using **Vercel** (Frontend) and **Render** (Backend).

## Prerequisites

1.  **GitHub Account**: You need to push this code to a GitHub repository.
2.  **Vercel Account**: Free tier.
3.  **Render Account**: Free tier (Web Services).

---

## Part 1: Backend Deployment (Render)

We deploy the backend first to get the API URL.

1.  **Push to GitHub**: Commit and push your code to a new repository.
2.  **Create Web Service on Render**:
    *   Go to [dashboard.render.com](https://dashboard.render.com).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Settings**:
    *   **Name**: `cognitive-dsa-backend` (or similar).
    *   **Root Directory**: `backend` (Important! This tells Render to look in the backend folder).
    *   **Runtime**: `Python 3`.
    *   **Build Command**: `pip install -r requirements.txt`.
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`.
4.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add the following (from your local `.env` if you have them, or use the defaults provided in code):
        *   `JUDGE0_API_KEY`: (Your Key)
        *   `GOOGLE_API_KEY`: (Your Gemini Key)
        *   `GROQ_API_KEY`: (Your Groq Key)
        *   `JUDGE0_HOST`: `ce.judge0.com` (optional, since we hardcoded it for this update).
5.  **Deploy**: Click **Create Web Service**.
6.  **Copy URL**: Once deployed, copy the service URL (e.g., `https://cognitive-dsa-backend.onrender.com`).
    *   *Note: On the free tier, the backend spins down after inactivity. The first request might take 50s.*

---

## Part 2: Frontend Deployment (Vercel)

1.  **Go to Vercel**: [vercel.com](https://vercel.com).
2.  **Add New Project**: Import the same GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: `./` (default).
4.  **Environment Variables**:
    *   Add a new variable:
        *   **Name**: `VITE_API_BASE_URL`
        *   **Value**: The Render URL you copied (e.g., `https://cognitive-dsa-backend.onrender.com`).
        *   *Important*: Do not add a trailing slash `/`.
5.  **Deploy**: Click **Deploy**.

## Part 3: Final Verification

1.  Open your deployed Vercel app.
2.  Go to **Problem List**. If problems load, the connection is working!
3.  Try submitting code.

## Troubleshooting

*   **CORS Errors**: Ensure the backend `main.py` has `allow_origins=["*"]` (which we included).
*   **"gunicorn: command not found" Error**: This happens if Render defaults to WSGI. Go to **Settings** and update the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port 10000`.
*   **Cold Starts**: If the app seems "stuck" loading problems, it's likely the Render backend waking up. Wait 1 minute.
*   **API URL**: Double check `VITE_API_BASE_URL` in Vercel settings. It must match the HTTPS URL of your Render backend.
