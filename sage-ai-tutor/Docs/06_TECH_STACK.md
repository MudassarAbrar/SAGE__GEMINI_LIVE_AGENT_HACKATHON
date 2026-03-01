# 🛠️ Tech Stack Document
## SAGE — Empathetic AI Pair Tutor
**Version:** 1.0 | **Date:** 2026-03-01

---

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│  LAYER          │  TECHNOLOGY              │  VERSION    │
├─────────────────┼──────────────────────────┼────────────-│
│  Frontend       │  React + Vite            │  19 / 6.x   │
│  Editor         │  Monaco Editor           │  0.46.x     │
│  Styling        │  TailwindCSS             │  3.x        │
│  State          │  Zustand                 │  4.x        │
│  Real-time Comm │  WebSocket (native)      │  Browser API│
│  Camera/Mic     │  WebRTC MediaStream API  │  Browser API│
├─────────────────┼──────────────────────────┼────────────-│
│  Backend        │  Python FastAPI          │  0.110.x    │
│  AI Orchestras. │  Google ADK (Python)     │  Latest     │
│  WebSocket Srv  │  FastAPI + WebSockets    │  Built-in   │
│  Validation     │  Pydantic v2             │  2.x        │
│  HTTP Client    │  httpx                   │  0.27.x     │
├─────────────────┼──────────────────────────┼────────────-│
│  AI — Real-time │  Gemini 2.0 Flash Live   │  Latest     │
│  AI — Reasoning │  Gemini 2.5 Pro          │  Latest     │
│  AI — Audio     │  Gemini TTS              │  Latest     │
│  SDK            │  Google GenAI Python SDK │  0.8.x      │
├─────────────────┼──────────────────────────┼────────────-│
│  Hosting        │  Google Cloud Run        │  Managed    │
│  Database       │  Google Firestore        │  Native Mode│
│  File Storage   │  Google Cloud Storage    │  Managed    │
│  AI Endpoint    │  Vertex AI               │  Managed    │
│  Secrets        │  GCP Secret Manager      │  Managed    │
├─────────────────┼──────────────────────────┼────────────-│
│  Infra-as-Code  │  Terraform               │  1.7.x      │
│  Containers     │  Docker                  │  26.x       │
│  CI/CD          │  GitHub Actions          │  Latest     │
│  Code Sandbox   │  Judge0 API (CE)         │  v1.13      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### React 19 + Vite 6
- **Why React:** Component model perfectly fits SAGE's complex UI (editor, avatar, voice indicator, dashboard)
- **Why Vite:** Fastest dev server, instant HMR, minimal config for hackathon speed
- **Why not Next.js:** No SSR needed — this is a real-time WebRTC/WebSocket app; server components would add complexity without benefit

### Monaco Editor (`@monaco-editor/react`)
- **Why:** Same engine as VS Code — students recognize it immediately, full syntax highlighting for C/C++/Java/Python, rich JavaScript API for programmatic code editing
- **Key APIs Used:**
  - `editor.setValue(code)` — SAGE writes code
  - `editor.getModel().getValue()` — SAGE reads code
  - `editor.deltaDecorations()` — SAGE highlights lines
  - `editor.revealLine()` — Jump to specific line

### Zustand (State Management)
- **Why:** Minimal boilerplate vs Redux, perfect for managing session state, frustration score, SAGE speaking state across components
- **Why not Context API:** Too many re-renders with high-frequency frustration score updates

### TailwindCSS
- **Why:** Hackathon speed — no context-switching between CSS files and JSX
- The UI must look premium for the judge demo

---

## 3. Backend Stack

### Python FastAPI
- **Why Python:** Google ADK and Google GenAI SDK are Python-first; best Gemini integration
- **Why FastAPI:** WebSocket support built-in, async by default (critical for streaming), automatic OpenAPI docs, Pydantic validation
- **Async all the way:** Every Gemini call is async — FastAPI handles concurrent sessions without blocking

### Google ADK (Agent Development Kit)
- **Why ADK:** Handles the hardest parts of agent building:
  - Tool calling and result routing
  - Session memory management
  - Multi-turn conversation state
  - Built-in Gemini integration
- Without ADK, you'd manually write ~500 lines of orchestration code
- **Agent Definition:** Single `SageAgent` with 5 tools (read_code, edit_code, highlight_line, explain_concept, generate_card)

### Google GenAI Python SDK (`google-genai`)
- **Why:** Official SDK, best-in-class Gemini Live API support
- Used directly alongside ADK for the Live API streaming connection

---

## 4. AI Layer

### Gemini 2.0 Flash Live
- **Role:** The real-time brain — handles simultaneous audio + video input and audio output
- **Key Capabilities Used:**
  - Bidirectional audio streaming (student voice ↔ SAGE voice)
  - Live video frame analysis (facial expression detection)
  - Interrupt handling (student talks while SAGE is speaking)
  - Low-latency response (< 500ms typical)
- **Why Flash (not Pro) for Live:** Flash is optimized for speed — acceptable for real-time conversation. Pro would add 2–3s latency, breaking the conversational feel.

### Gemini 2.5 Pro (via Vertex AI)
- **Role:** Deep reasoning for end-of-session content generation
- **Used For:**
  - Analyzing full session transcript
  - Generating lesson report with nuanced mistake analysis
  - Writing the HTML learning card content
  - Creating "next topics" recommendations
- **Why Pro here:** Quality > speed for this batch task. The student waits 10–15s; accuracy matters more.

### Gemini TTS
- **Role:** Audio voiceover for HTML Learning Cards
- Converts 60-second summary text → MP3 audio file
- Uploaded to Cloud Storage, embedded in the HTML card

---

## 5. Google Cloud Services

### Cloud Run
- **What:** Managed serverless containers
- **Frontend:** React app served as static files via nginx container
- **Backend:** FastAPI app in Python container
- **Scaling:** Auto-scales to 0 when idle (zero cost), scales up on demand
- **Config:** Min instances: 0, Max: 10, Memory: 1GB, CPU: 2

### Firestore (Native Mode)
- **What:** Serverless NoSQL document database
- **Used For:** All persistent data (sessions, students, reports, card metadata)
- **Why Native Mode (not Datastore Mode):** Better real-time listener support

### Cloud Storage
- **What:** Object storage for generated files
- **buckets:**
  - `sage-learning-cards/` — HTML card files (public read)
  - `sage-audio/` — MP3 voiceover files (public read)

### Vertex AI
- **What:** Managed ML platform, hosts Gemini model endpoints
- **Used For:** End-of-session Gemini 2.5 Pro calls (proves GCP AI integration clearly to judges)

### Secret Manager
- **What:** Secure credentials storage
- **Stores:** GEMINI_API_KEY, JUDGE0_API_KEY

---

## 6. Infrastructure as Code (Bonus Requirement)

### Terraform
- **Provisions:**
  - Cloud Run services (frontend + backend)
  - Firestore database instance
  - Cloud Storage buckets with CORS and public access policy
  - Secret Manager secrets
  - Service accounts with IAM bindings
  - Vertex AI API enablement
- **Files:** `infra/main.tf`, `infra/variables.tf`, `infra/outputs.tf`
- **Deploy Command:** `terraform apply -var="project_id=YOUR_PROJECT"`

---

## 7. Code Sandbox (Judge0 CE)

- **What:** Open-source code execution API
- **Used For:** Running student's code safely and showing output
- **Why not build own:** Judge0 handles security sandboxing, resource limits, and 40+ language support out of the box
- **Self-hosted option:** Deploy Judge0 CE on Cloud Run for full GCP integration (bonus points)

---

## 8. Development Tools

| Tool | Purpose |
|---|---|
| Docker Desktop | Local container testing before Cloud Run |
| GitHub Actions | CI/CD: auto-deploy to Cloud Run on push to main |
| gcloud CLI | GCP resource management |
| Terraform | Infrastructure provisioning |
| Python 3.11 + uv | Fast Python package management |
| Node 20 + pnpm | Frontend package management |
| Postman | WebSocket testing during development |
