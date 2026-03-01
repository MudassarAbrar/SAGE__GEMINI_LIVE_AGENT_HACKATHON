# 📄 Product Requirements Document (PRD)
## SAGE — Empathetic AI Pair Tutor
**Version:** 1.0 | **Date:** 2026-03-01 | **Author:** Solo Builder | **Status:** Approved for Development

---

## 1. Executive Summary

**SAGE** is a real-time, multimodal AI tutoring agent that combines voice, vision, and UI control to provide emotionally intelligent coding education. Unlike static tutoring platforms, SAGE proactively detects when a student is stuck or frustrated and intervenes at exactly the right moment — just like a skilled human tutor sitting beside you.

**Hackathon Category:** Live Agents 🗣️ (Primary) + UI Navigator ☸️ + Creative Storyteller ✍️ (Secondary)
**Target Prize:** Grand Prize ($25,000) + Best Live Agent ($10,000)

---

## 2. Problem Statement

### The Pain
- 93% of CS students report feeling "lost" during solo problem-solving sessions
- Online tutors cost $40–$150/hour and are unavailable at 2AM when students grind DSA
- Static resources (YouTube, Stack Overflow) cannot adapt to *your* confusion in real-time
- Traditional AI chatbots wait to be asked — they miss the moment before the student gives up

### The Gap
> There is no AI system today that can **see you struggling**, **interrupt you empathetically**, **show you the fix on your screen**, and **document what you learned** — all in one seamless experience.

---

## 3. Product Vision

> *"SAGE watches you code, listens to your reasoning, feels when you're lost, shows you the fix, and documents your learning journey — automatically."*

---

## 4. Target Users

### Primary User: CS Students
- **Age:** 17–26
- **Context:** University students or self-taught developers
- **Subjects:** Programming Fundamentals, OOP, Data Structures & Algorithms
- **Languages:** C, C++, Java, Python
- **Device:** Laptop with webcam and microphone
- **Pain:** Stuck on bugs/concepts late at night, no human tutor available

### Secondary User: Coding Bootcamp Instructors
- Monitor student sessions asynchronously via lesson reports

---

## 5. Core Features

### F1: Live Multimodal Session
| Feature | Description | Priority |
|---|---|---|
| F1.1 | Browser-based Monaco IDE with language selector (C/C++/Java/Python) | P0 |
| F1.2 | Gemini Live API bidirectional voice stream (student speaks, SAGE speaks back) | P0 |
| F1.3 | Webcam feed streamed to Gemini Vision for facial expression analysis | P0 |
| F1.4 | Real-time keystroke activity monitoring (silence = no typing) | P0 |
| F1.5 | SAGE can be interrupted mid-sentence by student | P0 |

### F2: Frustration Detection Engine
| Feature | Description | Priority |
|---|---|---|
| F2.1 | Camera signal: furrowed brow, head-scratch, looking away from screen | P0 |
| F2.2 | Silence signal: no keystrokes for 30+ seconds in active coding window | P0 |
| F2.3 | Voice signal: sighs, hesitation, repeated words, long pauses | P0 |
| F2.4 | Weighted confidence score (Camera 40% + Silence 30% + Voice 30%) | P0 |
| F2.5 | Interrupt threshold: score > 65/100 triggers SAGE intervention | P0 |

### F3: UI Navigator (Screen Takeover)
| Feature | Description | Priority |
|---|---|---|
| F3.1 | SAGE can read the current code in Monaco Editor via JavaScript API | P0 |
| F3.2 | SAGE can write/modify code directly in Monaco Editor | P0 |
| F3.3 | SAGE highlights specific lines of code while explaining | P0 |
| F3.4 | SAGE runs code in sandboxed execution environment and shows output | P1 |
| F3.5 | SAGE can step through code execution with animated cursor | P1 |

### F4: Creative Storyteller Output
| Feature | Description | Priority |
|---|---|---|
| F4.1 | End-of-session Interactive HTML Learning Card generation | P0 |
| F4.2 | HTML card contains: syntax-highlighted code, concept explanation, animated diagram | P0 |
| F4.3 | Audio voiceover summary embedded in HTML card (Gemini TTS) | P0 |
| F4.4 | Shareable public URL for HTML card (Cloud Storage) | P0 |
| F4.5 | Structured Lesson Report: topics, mistakes, confidence trend, next steps | P0 |
| F4.6 | Lesson Report saved to student dashboard (Firestore) | P0 |

### F5: Student Dashboard
| Feature | Description | Priority |
|---|---|---|
| F5.1 | Session history with dates, topics, duration | P1 |
| F5.2 | Confidence score trend charts | P1 |
| F5.3 | "Study These Next" recommendations | P1 |
| F5.4 | Access to all past HTML learning cards | P1 |

---

## 6. User Stories

```
AS A cs student stuck on implementing a linked list at 2AM,
I WANT an AI tutor that notices I haven't typed in 2 minutes and sounds frustrated,
SO THAT it interrupts me, explains the concept verbally, and shows me the fix in my code editor.

AS A cs student finishing a tutoring session,
I WANT a beautiful, shareable summary of what I learned,
SO THAT I can review it later and share it with classmates.

AS A student who learns by hearing,
I WANT SAGE to narrate its explanations out loud,
SO THAT I can listen while watching the code being written.
```

---

## 7. Non-Functional Requirements

| Category | Requirement | Assumption |
|---|---|---|
| **Latency** | Frustration detection response < 2 seconds | Gemini Live API real-time stream |
| **Availability** | 99% uptime during hackathon demo | Cloud Run auto-scaling |
| **Security** | Camera/mic data never stored permanently | Streamed directly to Gemini, not saved |
| **Privacy** | No facial data persisted | In-memory processing only |
| **Scale** | Support 1–50 concurrent users (hackathon demo) | Cloud Run handles this |
| **Browser Support** | Chrome, Edge (WebRTC support required) | Standard modern browsers |
| **Cost** | < $10 total for hackathon | GCP $300 free credit |

---

## 8. Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| Frustration detection accuracy | > 70% true positive | Manual demo testing |
| Session completion rate | > 80% | Firestore session logs |
| HTML card generation time | < 15 seconds post-session | Performance timing |
| Voice interruption latency | < 1 second | Gemini Live API metrics |
| Judge wow-factor | Win ≥ 1 prize category | Hackathon result |

---

## 9. Explicit Non-Goals (YAGNI)

- ❌ Mobile app (browser-only for hackathon)
- ❌ Multi-student classroom mode
- ❌ Custom AI model training
- ❌ Payment/subscription system
- ❌ Integration with LMS systems (e.g., Canvas, Moodle)
- ❌ Student authentication with OAuth (session-based for hackathon)

---

## 10. Constraints

- Must use **Gemini model** (Gemini 2.0 Flash Live / Gemini 2.5 Pro)
- Must use **Google GenAI SDK or ADK**
- Must use **at least one Google Cloud service** (we use four)
- Backend **hosted on Google Cloud**
- Built entirely **solo** within hackathon timeline
- Budget: **$0 planned** (GCP $300 credit buffer)
