# Patient Health Intelligence Platform 🏥🤖

An automated AI-powered medical assistant platform that ingests structured and unstructured patient lab reports (PDFs), performs semantic retrieval-augmented generation (RAG) using **Gemini 2.5 Flash** and **Qdrant**, and tracks chronological health trends and comparisons over time.

---

## 📸 Proof of Concept & Features

Here is a visual walk-through of the main capabilities of the system:

### 1. Patient Health Dashboard
Secure patient dashboard with historical medical reports, layman summary retrieval, and file upload capabilities.


### 2. Layperson Medical Summary
Detailed AI-generated explanations of medical jargon (e.g., blood pressure indicators, cholesterol levels, glucose ranges) in simple, understandable terms.


### 3. RAG AI Patient Assistant
Interactive chat interface referencing specific historical lab reports to answer questions about health changes (e.g., tracking blood pressure or glucose increases).

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), TailwindCSS, Recharts (for trend plotting).
*   **Backend**: Spring Boot, Spring Security (JWT authentication), Spring AI (Google GenAI integration).
*   **Vector DB**: Qdrant (3072-dimensional vector search).
*   **Database**: PostgreSQL (relational storage for patient records and lab parameters).
*   **Deployment**: Docker Compose.

---

## ⚙️ How to Setup & Run

### Prerequisites
*   Docker & Docker Desktop installed.
*   Gemini API Key.

### 1. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:
```env
DB_URL=jdbc:postgresql://db:5432/healthcare
DB_USER=postgres
DB_PASSWORD=postgres
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=http://qdrant:6333
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### 2. Build and Launch Containers
Run the following command in the root directory to spin up the entire application stack:
```bash
docker compose up --build -d
```

Access the frontend dashboard at [http://localhost:5173](http://localhost:5173).
