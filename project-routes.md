---
# 🧠 5. COMPLETE ROUTES (Backend Plan)
---

## 🔐 Auth

- handled by Clerk

---

## 👤 User

- GET /me

---

## 🏢 Workspace

- POST /workspace
- GET /workspace/:id
- POST /workspace/:id/invite

---

## 📁 Project

- POST /project
- GET /workspace/:id/projects
- GET /project/:id

---

## 📋 Board

- GET /project/:id/board

---

## 📊 Column

- POST /column
- PATCH /column/:id

---

## 📝 Task

- POST /task
- PATCH /task/:id
- PATCH /task/:id/move
- DELETE /task/:id

---

## 💬 Comment

- POST /comment
- DELETE /comment/:id

---

## 📜 Activity

- GET /task/:id/activity

---

# 🧠 6. FRONTEND FLOW

---

## Dashboard

- Show projects

---

## Project Page

- Fetch board
- Render columns
- Render tasks

---

## Task Modal

- Edit
- Comment
- Assign

---

# 🔥 7. CORE DESIGN INSIGHT

You are building:

## 👉 A STATE MACHINE OF WORK

Each task moves through:
