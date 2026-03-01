# 📅 SDLC Phase Document
## SAGE — Empathetic AI Pair Tutor
## Solo Builder Hackathon Development Plan
**Version:** 1.0 | **Date:** 2026-03-01 | **Total Estimated Time:** 10–14 days

---

## ⚡ Day 0: Pre-Flight Checklist (Before Writing Any Code)

Complete these FIRST — blocking everything else:

- [ ] **Create GCP Account** → google.com/cloud → Get $300 free credit
- [ ] **Create Google AI Studio Account** → aistudio.google.com → Get free Gemini API key
- [ ] **Enable GCP APIs:**
  - [ ] Cloud Run API
  - [ ] Firestore API
  - [ ] Cloud Storage API
  - [ ] Vertex AI API
  - [ ] Secret Manager API
- [ ] **Install local tools:**
  - [ ] `gcloud CLI` (Google Cloud SDK)
  - [ ] `Docker Desktop`
  - [ ] `Terraform 1.7+`
  - [ ] `Python 3.11 + uv`
  - [ ] `Node 20 + pnpm`
- [ ] **Create GitHub repo:** `sage-ai-tutor` (public for judges)
- [ ] **Install Google ADK:** `pip install google-adk`
- [ ] **Verify Gemini Live API access** (test with the ADK quickstart)

---

## PHASE 1: Setup & Foundation
**Duration:** 1–2 days
**Goal:** Have a working skeleton with frontend ↔ backend communication

### Tasks

#### P1.T1 — Project Scaffolding
- [ ] Create monorepo structure:
  ```
  sage/
  ├── frontend/   (Vite + React + TypeScript)
  ├── backend/    (Python FastAPI)
  ├── infra/      (Terraform)
  └── README.md
  ```
- [ ] Initialize: `pnpm create vite frontend --template react-ts`
- [ ] Install frontend deps: `monaco-editor, zustand, tailwindcss`
- [ ] Initialize backend: `uv init backend && uv add fastapi uvicorn google-genai google-adk`

#### P1.T2 — Monaco Editor Integration
- [ ] Embed Monaco Editor in React app
- [ ] Add language selector (C / C++ / Java / Python)
- [ ] Implement `useMonaco` hook with `getValue()` and `setValue()` APIs
- [ ] Style with dark theme, VS Code-like UI
- [ ] Test: Can manually type and read code via JS API ✓

#### P1.T3 — WebSocket Connection
- [ ] FastAPI WebSocket endpoint: `ws://backend/ws/{session_id}`
- [ ] React `useWebSocket` hook with reconnect logic
- [ ] Message protocol defined (JSON messages with `type` field)
- [ ] Test: Frontend sends `{type: "ping"}`, Backend echoes `{type: "pong"}` ✓

#### P1.T4 — Basic Firestore Setup
- [ ] Initialize Firestore in GCP console
- [ ] Python Firestore client in backend
- [ ] Test: Create a session document, read it back ✓

### Phase 1 Deliverable
> A web page with Monaco Editor (multi-language), connected via WebSocket to a FastAPI backend, with Firestore storing session data. No AI yet.

---

## PHASE 2: Core Live Agent (The Heart)
**Duration:** 3–4 days
**Goal:** SAGE can see, hear, talk, and detect frustration

### Tasks

#### P2.T1 — Gemini Live API Connection
- [ ] Study ADK documentation: `LlmAgent`, `live_connect`
- [ ] Create `SageAgent` class using ADK with system prompt:
  ```
  You are SAGE, an empathetic AI coding tutor. You watch a student code,
  listen to their reasoning, and gently intervene when they seem stuck.
  You are warm, patient, and encouraging. Never condescending.
  You can see their camera feed and hear their voice.
  ```
- [ ] Establish bidirectional audio stream (student voice → Gemini → SAGE voice)
- [ ] Test: Talk to SAGE, it talks back with correct tutor personality ✓

#### P2.T2 — Camera + Video Streaming
- [ ] `useWebRTC` hook: request camera permission, get MediaStream
- [ ] Capture 1 frame per second (canvas snapshot → base64)
- [ ] Send frame to backend via WebSocket alongside audio
- [ ] Backend forwards video frames to Gemini Live API
- [ ] Test: SAGE can describe what it sees in the camera feed ✓

#### P2.T3 — Frustration Detection Engine
- [ ] `frustration_engine.py`:
  - Camera signal: parse Gemini's vision analysis for frustration keywords
  - Silence signal: track `seconds_since_last_keystroke` from frontend
  - Voice signal: parse Gemini's sentiment/emotion markers from audio
  - Compute weighted composite score
- [ ] Threshold logic: score > 65 → queue intervention
- [ ] Cooldown: 3-minute minimum between interventions
- [ ] Test: Cover camera, stop typing, sigh → SAGE should interrupt within 30s ✓

#### P2.T4 — SAGE Intervention (The WOW Moment)
- [ ] ADK Tool: `read_code()` — fetches Monaco Editor content
- [ ] ADK Tool: `edit_code(new_code)` — updates Monaco Editor via WebSocket
- [ ] ADK Tool: `highlight_lines(line_numbers)` — adds decoration to monaco
- [ ] Intervention prompt:
  ```
  The student's frustration score is {score}. They are working on {topic}.
  Their current code is: {code}
  Speak to them empathetically, identify the issue, and offer to help.
  If they accept, use edit_code and highlight_lines to demonstrate the fix.
  ```
- [ ] Test: Full intervention loop — SAGE detects → asks → student accepts → SAGE fixes code in editor ✓

#### P2.T5 — Interruption Handling
- [ ] Detect when student speaks while SAGE is speaking → stop SAGE audio
- [ ] Gemini Live API has native barge-in support — configure via ADK session settings
- [ ] Test: SAGE is mid-explanation, student interrupts with question → SAGE stops and listens ✓

### Phase 2 Deliverable
> SAGE can see you via webcam, hear you, detect when you're frustrated, interrupt you naturally, take over the Monaco Editor to fix your code, and can be interrupted mid-explanation. This is the hackathon demo.

---

## PHASE 3: UI Navigator Polish
**Duration:** 1–2 days
**Goal:** The editor takeover looks beautiful and educational

### Tasks

#### P3.T1 — Animated Code Writing
- [ ] When SAGE writes code, animate letter-by-letter (like typing effect)
- [ ] Show "SAGE is editing..." status indicator in editor toolbar
- [ ] SAGE's edits displayed in distinct color (gold/amber) then normalize

#### P3.T2 — Line Highlighting with Explanations
- [ ] Inline comment injected alongside highlighted line:
  `// ← SAGE: This is where the null check needs to go`
- [ ] Tooltip shown on hover for highlighted lines (SAGE's explanation)

#### P3.T3 — Code Execution Integration (P1 Feature)
- [ ] Judge0 CE API integration in backend
- [ ] "Run Code" button in Monaco toolbar
- [ ] Output display panel below editor
- [ ] SAGE automatically runs code after editing to show result ✓

### Phase 3 Deliverable
> The editor takeover is visually stunning and educational. Code appears letter by letter, relevant lines glow, and the execution result appears instantly.

---

## PHASE 4: Creative Storyteller — End-of-Session Output
**Duration:** 2–3 days
**Goal:** The HTML Learning Card and Lesson Report are generated and beautiful

### Tasks

#### P4.T1 — Session Transcript & Data Collection
- [ ] Throughout session, log all events to Firestore (`sessions/{id}/events`)
- [ ] Final code snapshot saved at session end
- [ ] Frustration timeline compiled from `frustration_logs`

#### P4.T2 — Gemini 2.5 Pro Analysis (via Vertex AI)
- [ ] `content_generator.py`: Send session data to Gemini 2.5 Pro
- [ ] Prompt engineering for structured JSON output:
  ```
  Analyze this coding session transcript. Return:
  1. topics_covered (array with mastery levels)
  2. mistakes_made (array with corrections and explanations)
  3. key_concept_title (one sentence)
  4. concept_explanation (3 paragraphs, clear and educational)
  5. corrected_code (final correct version with inline comments)
  6. voiceover_text (60-second audio script)
  7. next_topics (3 recommendations)
  8. diagram_description (what animated diagram to show)
  ```

#### P4.T3 — HTML Learning Card Generation
- [ ] Jinja2 HTML template with:
  - SAGE logo and student name header
  - Concept title and explanation
  - Syntax-highlighted code block (highlight.js)
  - CSS-animated concept diagram (SVG animation)
  - Embedded audio player
  - "What to Study Next" section
- [ ] Upload rendered HTML to Cloud Storage → public URL

#### P4.T4 — Audio Voiceover
- [ ] Gemini TTS API call with 60-second voiceover script
- [ ] MP3 file uploaded to Cloud Storage
- [ ] URL injected into HTML card template

#### P4.T5 — Lesson Report Dashboard
- [ ] Dashboard page: list of past sessions with topic tags
- [ ] Click session → view full Lesson Report
- [ ] Frustration timeline chart (Chart.js)
- [ ] Link to HTML Learning Card

### Phase 4 Deliverable
> At session end, a beautiful HTML learning card appears with animated diagrams, audio voiceover, and syntax-highlighted corrected code. Saved permanently in the dashboard.

---

## PHASE 5: Deployment & Hackathon Polish
**Duration:** 1–2 days**
**Goal:** Live on Google Cloud, Terraform IaC, README complete, video recorded**

### Tasks

#### P5.T1 — Dockerize Both Services
- [ ] `frontend/Dockerfile` — nginx serves built React app
- [ ] `backend/Dockerfile` — uvicorn serves FastAPI app
- [ ] `docker-compose.yml` — local full-stack testing
- [ ] Test: Both services run locally in Docker ✓

#### P5.T2 — Terraform Infrastructure
- [ ] `infra/main.tf`:
  - Enable required APIs
  - Cloud Run: frontend service
  - Cloud Run: backend service
  - Firestore database
  - Cloud Storage buckets (sage-cards, sage-audio)
  - Secret Manager secret (GEMINI_API_KEY)
  - Service account with IAM bindings
- [ ] `terraform apply` → all resources created ✓

#### P5.T3 — GitHub Actions CI/CD
- [ ] On push to `main`:
  - Build Docker images
  - Push to Google Artifact Registry
  - Deploy to Cloud Run (`gcloud run deploy`)
- [ ] Bonus: This **proves automated deployment** for the hackathon bonus criterion

#### P5.T4 — README.md
- [ ] Project description and demo GIF
- [ ] Architecture diagram (exported from Mermaid)
- [ ] Complete spin-up instructions for judges:
  ```bash
  git clone https://github.com/you/sage-ai-tutor
  cd sage-ai-tutor
  cp .env.example .env
  # Add your GEMINI_API_KEY
  docker-compose up
  # Open http://localhost:3000
  ```
- [ ] GCP deployment instructions with Terraform

#### P5.T5 — Demo Video (< 4 minutes)
Script:
```
0:00-0:30  Problem statement: "Students get stuck at 2AM with no help"
0:30-1:00  SAGE introduction — show the interface
1:00-2:30  LIVE DEMO:
           - Start session
           - Student codes (incorrectly)
           - Gets stuck (stops typing, sighs)
           - SAGE detects → interrupts ("You look stuck...")
           - SAGE takes over editor, fixes code, explains
           - Student asks follow-up
2:30-3:00  End session → HTML card reveal (wow moment)
3:00-3:30  Dashboard with lesson report
3:30-4:00  Architecture diagram + GCP deployment proof
```

#### P5.T6 — Blog Post (Bonus)
- [ ] Write on Medium or Dev.to:
  **"How I Built an Empathetic AI Coding Tutor with Gemini Live API and Google ADK"**
- [ ] Include: `#GeminiLiveAgentChallenge` hashtag
- [ ] Include statement: *"I created this content for the purposes of entering the Gemini Live Agent Challenge hackathon."*

#### P5.T7 — Google Developer Group Signup (Bonus)
- [ ] Sign up at gdg.community.dev
- [ ] Get your public GDG profile URL

### Phase 5 Deliverable
> SAGE is live at a public GCP Cloud Run URL. Terraform provisions everything. README lets judges spin it up. Demo video is < 4 minutes. Blog post published. All bonus criteria met.

---

## Timeline Summary

```
Day 0:   Pre-flight setup (GCP, APIs, tools)
Day 1-2: Phase 1 — Foundation + Monaco + WebSocket + Firestore
Day 3-6: Phase 2 — Gemini Live + Camera + Frustration Detection + Intervention ← HARDEST
Day 7-8: Phase 3 — UI Navigator polish + Code execution
Day 9-11: Phase 4 — HTML card + Lesson report + Dashboard
Day 12-14: Phase 5 — Docker + Terraform + Deploy + README + Video + Blog
```

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Gemini Live API rate limits | Medium | High | Use AI Studio key (free tier) + exponential backoff |
| Camera permission UX friction | High | Medium | Show clear UI explaining why camera is needed |
| Audio echo/feedback loop | Medium | High | Use headphones in demo, add echo cancellation |
| Code execution sandbox timeout | Low | Medium | 10s timeout with friendly error message |
| Terraform apply fails first time | Medium | Low | Have manual gcloud commands as fallback |
| Phase 2 takes longer than expected | High | High | Phase 3 and P1 features are cuttable — Phase 2 alone wins |
