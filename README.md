# Construction & Renewables Job Portal

A modern, responsive construction and renewable energy recruitment tracker dashboard featuring multi-role segmentation (Site Manager, Project Manager, HSE), direct recruiter contact channels (Email, Phone, Zalo, Facebook), and an in-dashboard Social Post Simulator.

---

## Folder Structure
- `/frontend`: React + Vite + Tailwind + ECharts application (Frontend).
- `/backend`: FastAPI + Uvicorn server (Backend API & Scraper).

---

## 🚀 How to Deploy to Vercel

Since this repository contains both the frontend and backend in a monorepo structure, Vercel needs to be told where the frontend resides.

### Step 1: Push Code to GitHub
Before Vercel can see your code, ensure you have pushed your local commits to your GitHub repository:
```bash
git push -u origin main
```

### Step 2: Configure Vercel Project Settings
1. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
2. Select your GitHub repository `jobs` (or `anhmes-del/jobs`). 
   *(Note: If the repository is private and not showing up, click "Adjust GitHub App Permissions" at the bottom of the list and grant Vercel access to the `jobs` repo).*
3. In the **Configure Project** screen, find **Root Directory** and click **Edit**.
4. Select the `frontend` folder and click **Continue**.
5. Vercel will automatically detect the project as a **Vite** application.
6. Click **Deploy**. Vercel will build and deploy your frontend successfully!

### Step 3: Backend API Configuration (Optional)
If you deploy your backend API (FastAPI) to services like Render, Railway, or Fly.io:
1. Go to your Vercel Project **Settings** > **Environment Variables**.
2. Add a new variable named `VITE_API_URL` and set its value to your deployed backend API URL (e.g., `https://your-backend.railway.app`).
