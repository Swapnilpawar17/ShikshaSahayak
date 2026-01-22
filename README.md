# 🎓 Just-in-Time Teacher Coach (Shiksha Sahayak)

An AI-powered system that closes the loop between individual teacher queries and systemic district-wide training.

## 🌟 Features

1.  **📲 Teacher Interface (WhatsApp Simulator):**
    - Teachers ask classroom queries via mobile.
    - AI (GPT-4) provides immediate, pedagogical solutions.

2.  **⚡ Systemic Pattern Detection:**
    - The system aggregates teacher queries.
    - Identifies hot-spots (e.g., "40% of Grade 5 teachers struggle with Fractions").
    - **Auto-generates Training Modules** based on successful interventions.

3.  **📊 District Dashboard:**
    - Real-time analytics of classroom challenges.
    - One-click deployment of training modules to the cluster.

## 🛠️ Tech Stack

-   **Frontend:** React.js
-   **Backend:** Node.js & Express
-   **Database:** PostgreSQL
-   **AI:** OpenAI GPT-4 (Simulated for Demo)
-   **Mobile:** HTML5 WhatsApp Simulator

## 🚀 How to Run Locally

### 1. Backend
```bash
cd backend
npm install
# Create .env file with DATABASE_URL
node server.js