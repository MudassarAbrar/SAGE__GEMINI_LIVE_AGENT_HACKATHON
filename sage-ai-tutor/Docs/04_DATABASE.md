# 🗄️ Database Detail Document
## SAGE — Empathetic AI Pair Tutor
## Google Firestore (Native Mode, NoSQL)
**Version:** 1.0 | **Date:** 2026-03-01

---

## 1. Database Choice Rationale

| Factor | Firestore | PostgreSQL | Redis |
|---|---|---|---|
| Serverless / no config | ✅ | ❌ | ❌ |
| GCP native integration | ✅ | ⚠️ (Cloud SQL) | ⚠️ |
| Real-time listeners | ✅ (built-in) | ❌ | ❌ |
| Free tier | ✅ 50K reads/day | ❌ | ❌ |
| JSON-native storage | ✅ | ❌ | ⚠️ |
| Scales to 0 | ✅ | ❌ | ❌ |

**Decision:** Firestore is the clear winner for a solo hackathon on Google Cloud.

---

## 2. Firestore Collection Structure

```
firestore/
├── sessions/                    # Active and completed tutoring sessions
│   └── {session_id}/
│       ├── [session document]
│       ├── events/              # Sub-collection: all session events
│       │   └── {event_id}/
│       └── frustration_logs/   # Sub-collection: frustration scores over time
│           └── {log_id}/
│
├── students/                    # Student profiles and preferences
│   └── {student_id}/
│       ├── [student document]
│       └── reports/             # Sub-collection: all lesson reports
│           └── {report_id}/
│
└── learning_cards/              # Generated HTML learning card metadata
    └── {card_id}/
```

---

## 3. Collection Schemas

### 3.1 `sessions` Collection

**Document ID:** Auto-generated UUID (e.g., `sess_7f3a2b9c`)

```json
{
  "session_id": "sess_7f3a2b9c",
  "student_id": "student_abc123",
  "status": "active | completed | abandoned",
  "language": "python | java | c | cpp",
  "topic_hint": "Linked Lists",
  "start_time": "2026-03-01T03:00:00Z",
  "end_time": "2026-03-01T03:45:00Z",
  "duration_seconds": 2700,
  "code_snapshots": [
    {
      "timestamp": "2026-03-01T03:05:00Z",
      "code": "class Node:\n    def __init__(self, val)...",
      "snapshot_reason": "frustration_detected | manual | periodic"
    }
  ],
  "interventions_count": 3,
  "avg_frustration_score": 42.5,
  "peak_frustration_score": 78,
  "learning_card_id": "card_9d1e4f2a",
  "lesson_report_id": "report_5c7b8e1d",
  "created_at": "2026-03-01T03:00:00Z",
  "updated_at": "2026-03-01T03:45:00Z"
}
```

**Indexes:**
- `student_id + start_time DESC` (dashboard history query)
- `status + start_time` (active session lookup)

---

### 3.2 `sessions/{id}/events` Sub-Collection

**Document ID:** Auto-generated, ordered by timestamp

```json
{
  "event_id": "evt_001",
  "event_type": "sage_spoke | student_spoke | intervention | code_edit | session_start | session_end",
  "timestamp": "2026-03-01T03:12:30Z",
  "actor": "sage | student",
  "content": {
    "text": "Hey, looks like you might be stuck on this pointer. Want me to help?",
    "code_before": "int* ptr = malloc(sizeof(int));",
    "code_after": "int* ptr = (int*)malloc(sizeof(int));",
    "highlighted_lines": [12, 13],
    "frustration_score_at_time": 71
  }
}
```

---

### 3.3 `sessions/{id}/frustration_logs` Sub-Collection

**Document ID:** Timestamp-based (every 30 seconds)

```json
{
  "log_id": "log_20260301_030230",
  "timestamp": "2026-03-01T03:02:30Z",
  "camera_score": 35,
  "silence_score": 25,
  "voice_score": 18,
  "composite_score": 26.9,
  "threshold_crossed": false,
  "seconds_since_keystroke": 22
}
```

---

### 3.4 `students` Collection

**Document ID:** UUID generated at first session (no auth for hackathon — browser fingerprint)

```json
{
  "student_id": "student_abc123",
  "display_name": "Alex",
  "preferred_language": "python",
  "total_sessions": 12,
  "total_study_minutes": 480,
  "topics_studied": ["linked_lists", "recursion", "sorting_algorithms", "oop_inheritance"],
  "strongest_topics": ["recursion", "oop_inheritance"],
  "weakest_topics": ["pointers", "dynamic_programming"],
  "avg_frustration_score": 38.2,
  "streak_days": 5,
  "last_session_date": "2026-03-01T03:45:00Z",
  "created_at": "2026-02-15T10:00:00Z",
  "updated_at": "2026-03-01T03:45:00Z"
}
```

---

### 3.5 `students/{id}/reports` Sub-Collection

```json
{
  "report_id": "report_5c7b8e1d",
  "session_id": "sess_7f3a2b9c",
  "generated_at": "2026-03-01T03:47:00Z",
  "language": "python",
  "duration_minutes": 45,
  "topics_covered": [
    {
      "topic": "Linked List Node Creation",
      "mastery_level": "understanding",
      "time_spent_minutes": 20
    },
    {
      "topic": "Pointer Traversal",
      "mastery_level": "partial",
      "time_spent_minutes": 15
    }
  ],
  "mistakes_made": [
    {
      "mistake": "Forgot to handle None/null as loop termination",
      "correction": "Add `while current is not None` check",
      "sage_explanation": "In linked lists, traversal must always check for null/None before accessing .next",
      "line_number": 23
    }
  ],
  "interventions": [
    {
      "at_time": "2026-03-01T03:12:30Z",
      "trigger": "frustration_score_78",
      "topic": "pointer arithmetic",
      "accepted": true
    }
  ],
  "frustration_timeline": [
    {"time": "00:05", "score": 20},
    {"time": "00:12", "score": 78},
    {"time": "00:15", "score": 35},
    {"time": "00:30", "score": 15}
  ],
  "next_topics_recommended": [
    "Doubly Linked Lists",
    "Linked List deletion (middle node)",
    "Floyd's cycle detection algorithm"
  ],
  "sage_summary": "Today you built a singly linked list from scratch. You initially struggled with null checks during traversal, but once we covered that pattern, you applied it confidently. Ready to try doubly linked lists next!",
  "learning_card_url": "https://storage.googleapis.com/sage-cards/card_9d1e4f2a.html"
}
```

---

### 3.6 `learning_cards` Collection

```json
{
  "card_id": "card_9d1e4f2a",
  "session_id": "sess_7f3a2b9c",
  "student_id": "student_abc123",
  "generated_at": "2026-03-01T03:46:30Z",
  "html_url": "https://storage.googleapis.com/sage-cards/card_9d1e4f2a.html",
  "audio_url": "https://storage.googleapis.com/sage-audio/card_9d1e4f2a.mp3",
  "title": "Linked List Traversal in Python",
  "concept_covered": "Null pointer handling in linked list traversal",
  "language": "python",
  "is_public": true,
  "view_count": 0,
  "created_at": "2026-03-01T03:46:30Z"
}
```

---

## 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Students can only access their own data
    match /students/{studentId} {
      allow read, write: if request.auth == null &&
        resource.data.student_id == request.headers['X-Student-Id'];
    }

    // Sessions readable by the owning student
    match /sessions/{sessionId} {
      allow read: if resource.data.student_id ==
        request.headers['X-Student-Id'];
      allow write: if true; // Backend writes only
    }

    // Learning cards are public (shareable links)
    match /learning_cards/{cardId} {
      allow read: if resource.data.is_public == true;
      allow write: if false; // Backend writes only
    }
  }
}
```

---

## 5. Data Retention Policy

| Collection | Retention | Rationale |
|---|---|---|
| `sessions` | 90 days | Student review of recent sessions |
| `sessions/events` | 30 days | Detailed data, large size |
| `sessions/frustration_logs` | 30 days | Analytics only |
| `students` | Forever | Core profile data |
| `students/reports` | 1 year | Learning progress history |
| `learning_cards` | 1 year | Shareable cards should be accessible |

---

## 6. Query Patterns

| Query | Collection | Index Needed |
|---|---|---|
| Get last 10 sessions for student | `sessions` | `student_id + start_time DESC` |
| Get active session | `sessions` | `status == "active" + student_id` |
| Get all reports for student | `students/{id}/reports` | Default (`generated_at DESC`) |
| Get frustration timeline | `sessions/{id}/frustration_logs` | Default (`timestamp ASC`) |
| Get session events | `sessions/{id}/events` | Default (`timestamp ASC`) |
